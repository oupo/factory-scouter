import json
import time
from z3 import *

nstarters = 6
nbattles = 7
npartymembers = 3

entry_id_to_pokemon_id = []
entry_id_to_item_id = []

with open("factory-data.csv", "r") as f:
    for line in f:
        [pokemon_id, nature, item_id] = [int(x) for x in line.split(",")[0:3]]
        entry_id_to_pokemon_id.append(pokemon_id)
        entry_id_to_item_id.append(item_id)

with open("data.json", "r") as f:
    data = json.load(f)

for number, d in enumerate(data):
    [starters, enemies, skipped] = d
    starter_choose = []
    for x in starters:
        starter_choose.append(Bool("starter_chooce_"+str(x)))

    throw = []
    for x in range(nbattles - 2):
        throw.append([])
        for y in range(nstarters):
            throw[x].append(Bool("throw_"+str(x)+"_starter"+str(y)))
        for y in range(x):
            for z in range(npartymembers):
                throw[x].append(Bool("throw_"+str(x)+"_"+str(y)+"_"+str(z)))

    pickup = []
    for x in range(nbattles - 2):
        pickup.append([])
        for y in range(3):
            pickup[x].append(Bool("pickup_"+str(x)+"_"+str(y)))

    def valid_choose():
        choose = [[0, 1, 2], [0, 1, 3], [0, 1, 4], [0, 1, 5], [0, 2, 3], [0, 2, 4], [0, 2, 5], [0, 3, 4], [0, 3, 5], [0, 4, 5], [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5], [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]]
        exprs = []
        # 6匹の中からちょうど3匹
        for x in choose:
            exprs.append(And([(starter_choose[i] if (i in x) else Not(starter_choose[i])) for i in range(6)]))
        return Or(exprs)

    # 第point戦目の手前でスターターiをプレイヤーが持っているか
    def player_has_starter(point, i):
        exprs = []
        exprs.append(starter_choose[i])
        for x in range(point):
            exprs.append(Not(throw[x][i]))
        return And(exprs)

    # 第point戦目の手前でi戦目のj匹目をプレイヤーが持っているか
    def player_has(point, i, j):
        exprs = []
        exprs.append(pickup[i][j])
        idx = nstarters + npartymembers * i + j
        for x in range(i + 1, point):
            exprs.append(Not(throw[x][idx]))
        return And(exprs)

    def valid_exchange():
        exprs = []
        for x in range(nbattles - 2):
            # 第x戦 (x=0, 1, …, 4)と第x+1戦の間の交換
            # 拾うポケモンは1匹以下
            exprs.append(Or([And([Not(pickup[x][0]), Not(pickup[x][1]), Not(pickup[x][2])]),
                            And([pickup[x][0], Not(pickup[x][1]), Not(pickup[x][2])]),
                            And([Not(pickup[x][0]), pickup[x][1], Not(pickup[x][2])]),
                            And([Not(pickup[x][0]), Not(pickup[x][1]), pickup[x][2]])]))
            # 拾う場合は捨てるポケモンはちょうど1匹
            exprs.append(Implies(Or(pickup[x]), Or([And([th2 if th2 == th else Not(th2) for th2 in throw[x]]) for th in throw[x]])))
            # 捨てるときはそれは手もちにいないといけない
            for y in range(nstarters):
                exprs.append(Implies(throw[x][y], player_has_starter(x, y)))
            for y in range(x):
                for z in range(npartymembers):
                    exprs.append(Implies(throw[x][nstarters + y * npartymembers + z], player_has(x, y, z)))
        return And(exprs)

    def collide(e1, e2):
        return entry_id_to_pokemon_id[e1] == entry_id_to_pokemon_id[e2] or entry_id_to_item_id[e1] == entry_id_to_item_id[e2]

    def valid_enemies():
        exprs = []
        for x in range(1, nbattles):
            # enemiesと被るものはプレイヤーは持っていない
            for entry in enemies[x]:
                e = []
                for y in range(nstarters):
                    entry2 = starters[y]
                    if collide(entry, entry2):
                        e.append(Not(player_has_starter(x - 1, y)))
                for y in range(x):
                    for z in range(npartymembers):
                        entry2 = enemies[y][z]
                        if collide(entry, entry2):
                            e.append(Not(player_has(x - 1, y, z)))
                exprs.append(And(e))
            # skippedと被るものはプレイヤーは持っている
            for entry in skipped[x]:
                e = []
                for y in range(nstarters):
                    entry2 = starters[y]
                    if collide(entry, entry2):
                        e.append(player_has_starter(x - 1, y))
                for y in range(x):
                    for z in range(npartymembers):
                        entry2 = enemies[y][z]
                        if collide(entry, entry2):
                            e.append(player_has(x - 1, y, z))
                exprs.append(Or(e))
        return And(exprs)

    start = time.time()
    s = Solver()
    s.add(valid_choose())
    s.add(valid_exchange())
    s.add(valid_enemies())
    r = s.check()
    end=  time.time()
    print(number, end=": ")
    print(r, end="")
    print(" ("+str(end - start)+" sec)")

