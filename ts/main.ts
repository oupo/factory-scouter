import {POKEMON_NAMES} from './data';

let POKEMON_NAME_TO_ID: { [key: string]: number; }= {};
POKEMON_NAMES.forEach((name, i) => {
    POKEMON_NAME_TO_ID[name] = i;
});
console.log(POKEMON_NAME_TO_ID);

function pokemon_image(id: number) {
    return `http://veekun.com/dex/media/pokemon/icons/${id}.png`;
}

function switch_to_poke_form() {
    $('.subcontainer').hide();
    $('#poke-form').show();
    $('.breadcrumb-item').removeClass('selected');
    $('#breadcrumb-poke').addClass('selected');
}

function switch_to_round_form() {
    $('.subcontainer').hide();
    $('#round-form').show();
    $('.breadcrumb-item').removeClass('selected');
    $('#breadcrumb-round').addClass('selected');
}

$(() => {
    $('#ok-round').click((e) => {
        switch_to_poke_form();
    });
    $('#breadcrumb-poke').click((e) => {
        switch_to_poke_form();
    });
    $('#breadcrumb-round').click((e) => {
        switch_to_round_form();
    });
    for (let i = 0; i < 6; i ++) {
        $('#poke' + i).on('input', (e) => {
            const input = <HTMLInputElement>e.target;
            const name = input.value;
            if (name != "" && name in POKEMON_NAME_TO_ID) {
                const id = POKEMON_NAME_TO_ID[name];
                $("#pokeimg" + i).empty().append($('<img />').attr('src', pokemon_image(id)));
            } else {
                $("#pokeimg" + i).empty();
            }
        });
    }
});
