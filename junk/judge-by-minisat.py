import json
import time

nstarters = 6
nbattles = 7
npartymembers = 3

def Not(x): return "-" + x

def collide(e1, e2):
    return entry_id_to_pokemon_id[e1] == entry_id_to_pokemon_id[e2] or entry_id_to_item_id[e1] == entry_id_to_item_id[e2]

def collide_in(e, entries):
    any(collide(e, e2) for e2 in entries) 

variable_count = 0

def Var(name):
    global variable_count
    variable_count += 1
    return str(variable_count)

entry_id_to_pokemon_id = []
entry_id_to_item_id = []

with open("factory-data.csv", "r") as f:
    for line in f:
        [pokemon_id, nature, item_id] = [int(x) for x in line.split(",")[0:3]]
        entry_id_to_pokemon_id.append(pokemon_id)
        entry_id_to_item_id.append(item_id)

with open("data.json", "r") as f:
    data = json.load(f)

#data = [data[0]]
choose = [[0, 1, 2], [0, 1, 3], [0, 1, 4], [0, 1, 5], [0, 2, 3], [0, 2, 4], [0, 2, 5], [0, 3, 4], [0, 3, 5], [0, 4, 5], [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]]

for number, d in enumerate(data):
    variable_count = 0
    [starters, enemies, skipped] = d
    
    # 例) starter[0]: スターターの0匹目と1匹目と2匹目を選出
    starter = []
    for x in choose:
        starter.append(Var("starter_"+"".join(map(str, x))))

    # starter_choose[x]: スターターのx匹目を選出
    starter_choose = []
    for x in range(nstarters):
        starter_choose.append(Var("starter_choose_"+str(x)))

    # throw[x][y]: 第x戦と第x+1戦の間の交換でスターターyを捨てる
    # throw[x][nstarters + npartymembers * y + z]: 第x戦と第x+1戦の間の交換でy戦目のz番目のポケモンを捨てる 
    throw = []
    for x in range(nbattles - 2):
        throw.append([])
        for y in range(nstarters):
            throw[x].append(Var("throw_"+str(x)+"_starter"+str(y)))
        for y in range(x):
            for z in range(npartymembers):
                throw[x].append(Var("throw_"+str(x)+"_"+str(y)+"_"+str(z)))

    # pickup[x][y]: 第x戦と第x+1戦の間の交換でx戦目のy番目のポケモンを拾う
    pickup = []
    for x in range(nbattles - 2):
        pickup.append([])
        for y in range(3):
            pickup[x].append(Var("pickup_"+str(x)+"_"+str(y)))

    player_has_starter = [None]
    # 第x戦目の敵決定手前でスターターyをプレイヤーが持っているか
    for x in range(1, nbattles):
        player_has_starter.append([])
        for y in range(nstarters):
            player_has_starter[x].append(Var("player_has_starter_"+str(x)+"_"+str(y)))

    player_has = [None]
    # 第x戦目の敵決定手前でy戦目のz匹目をプレイヤーが持っているか
    for x in range(1, nbattles):
        player_has.append([])
        for y in range(x - 1):
            player_has[x].append([])
            for z in range(npartymembers):
                player_has[x][y].append(Var("player_has_"+str(x)+"_"+str(y)+"_"+str(z)))

    clauses = []

    # player_has_starterの定義式
    # player_has_starter[x][y] := 第x戦目の敵決定手前でスターターyをプレイヤーが持っているか

    for x in range(nstarters):
        clauses.append([Not(player_has_starter[1][x]), starter_choose[x]])
        clauses.append([Not(starter_choose[x]), player_has_starter[1][x]])
    
    for x in range(2, nbattles):
        for y in range(nstarters):
            clauses.append([Not(player_has_starter[x][y]), player_has_starter[x - 1][y]])
            clauses.append([Not(player_has_starter[x][y]), Not(throw[x - 2][y])])
            clauses.append([Not(player_has_starter[x-1][y]), throw[x - 2][y], player_has_starter[x][y]])

    # player_hasの定義式
    # player_has[x][y][z] := 第x戦目の敵決定手前でy戦目のz匹目をプレイヤーが持っているか
    for x in range(nbattles):
        for y in range(x - 1):
            for z in range(npartymembers):
                if y == x - 2:
                    clauses.append([Not(player_has[x][y][z]), pickup[y][z]])
                    clauses.append([Not(pickup[y][z]), player_has[x][y][z]])
                else:
                    clauses.append([Not(player_has[x][y][z]), player_has[x - 1][y][z]])
                    clauses.append([Not(player_has[x][y][z]), Not(throw[x - 2][nstarters + npartymembers * y + z])])
                    clauses.append([Not(player_has[x - 1][y][z]), throw[x - 2][nstarters + npartymembers * y + z], player_has[x][y][z]])

    # 6匹の中からちょうど3匹選ぶ
    clause = []
    clauses.append(clause)
    for x in starter:
        clause.append(x)
    
    for i, x in enumerate(choose):
        for y in range(nstarters):
            clause = []
            clauses.append(clause)
            clause.append(Not(starter[i]))
            if y in choose[i]:
                clause.append(starter_choose[y])
            else:
                clause.append(Not(starter_choose[y]))

    for x in range(nbattles - 2):
        # 第x戦 (x=0, 1, …, 4)と第x+1戦の間の交換
        # 拾うポケモンは1匹以下
        for y in range(npartymembers):
            for z in range(y + 1, npartymembers):
                clause = []
                clauses.append(clause)
                clause.append(Not(pickup[x][y]))
                clause.append(Not(pickup[x][z]))

    # 拾うポケモンは1匹以下
    for x in range(nbattles - 2):
        for y in range(npartymembers):
            for z in range(y + 1, npartymembers):
                clause = []
                clauses.append(clause)
                clause.append(Not(pickup[x][y]))
                clause.append(Not(pickup[x][z]))

    # 拾う場合、捨てるポケモンは少なくとも1匹
    for x in range(nbattles - 2):
        for y in range(npartymembers):
            clause = []
            clauses.append(clause)
            clause.append(Not(pickup[x][y]))
            for z in range(len(throw[x])):
                clause.append(throw[x][z])
    
    # 拾う場合、捨てるポケモンはたかだか1匹
    for x in range(nbattles - 2):
            for z1 in range(len(throw[x])):
                for z2 in range(z1 + 1, len(throw[x])):
                    clause = []
                    clauses.append(clause)
                    clause.append(Not(pickup[x][y]))
                    clause.append(Not(throw[x][z1]))
                    clause.append(Not(throw[x][z2]))

    # 捨てる場合、それをその時点で持っていなければならない
    for x in range(nbattles - 2):
        throw.append([])
        for y in range(nstarters):
            clauses.append([Not(throw[x][y]), player_has_starter[x+1][y]])
        for y in range(x):
            for z in range(npartymembers):
                clauses.append([Not(throw[x][nstarters + npartymembers * y + z]), player_has[x+1][y][z]])

    # enemiesと被るものはプレイヤーは持っていない
    for x in range(1, nbattles):
        for entry in enemies[x]:
            e = []
            for y in range(nstarters):
                entry2 = starters[y]
                if collide(entry, entry2):
                    clauses.append([Not(player_has_starter[x][y])])
            for y in range(x):
                for z in range(npartymembers):
                    entry2 = enemies[y][z]
                    if collide(entry, entry2):
                        clauses.append([Not(player_has[x][y][z])])

    # skippedと被るものはプレイヤーは持っている
    for x in range(1, nbattles):
        for entry in skipped[x]:
            if collide_in(entry, enemies[x-1]):
                continue
            clause = []
            clauses.append(clause)
            for y in range(nstarters):
                entry2 = starters[y]
                if collide(entry, entry2):
                    clause.append(player_has_starter[x][y])
            for y in range(x):
                for z in range(npartymembers):
                    entry2 = enemies[y][z]
                    if collide(entry, entry2):
                        clause.append(player_has[x][y][z])

    with open("data"+str(number)+".cnf", "w") as f:
        print('p cnf ' + str(variable_count) + ' ' + str(len(clauses)), file=f)
        for clause in clauses:
            print(' '.join(clause + ['0']), file=f)
