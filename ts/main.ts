import {POKEMON_NAMES} from './data';
import {PRNG} from './prng';
import {FactoryHelper} from './factory-helper';
import {Predictor} from './predictor';

let POKEMON_NAME_TO_ID: { [key: string]: number; }= {};
POKEMON_NAMES.forEach((name, i) => {
    POKEMON_NAME_TO_ID[name] = i;
});

console.log(Predictor.predict(new PRNG(0)));

function pokemon_image(id: number) {
    return `http://veekun.com/dex/media/pokemon/icons/${id}.png`;
}

function switch_to_search_form() {
    $('.container').hide();
    $('#search').show();
    $('.nav-item').removeClass('active');
    $('#nav-item-search').addClass('active');
}

function switch_to_seed_form() {
    $('.container').hide();
    $('#seed-form').show();
    $('.nav-item').removeClass('active');
    $('#nav-item-seed').addClass('active');
}

function switch_to_result() {
    $('.container').hide();
    $('#result').show();
    $('.nav-item').removeClass('active');
    $('#nav-item-result').addClass('active');
}

function switch_to_round_form() {
    $('.subcontainer').hide();
    $('#round-form').show();
    $('.breadcrumb-item').removeClass('selected');
    $('#breadcrumb-round').addClass('selected');
}

function switch_to_poke_form() {
    $('.subcontainer').hide();
    $('#poke-form').show();
    $('.breadcrumb-item').removeClass('selected');
    $('#breadcrumb-poke').addClass('selected');
}

function switch_to_entries_form() {
    $('.subcontainer').hide();
    $('#entries-form').show();
    $('.breadcrumb-item').removeClass('selected');
    $('#breadcrumb-entries').addClass('selected');
}

function switch_to_id_form() {
    $('.subcontainer').hide();
    $('#id-form').show();
    $('.breadcrumb-item').removeClass('selected');
    $('#breadcrumb-id').addClass('selected');
    const name = <string>$('#poke0').val();
    if (name != "" && name in POKEMON_NAME_TO_ID) {
        const id = POKEMON_NAME_TO_ID[name];
        $('#poke0-name').empty().append($("<span/>").text(name)).append($('<img />').attr('src', pokemon_image(id)));
    } else {
        $('#poke0-name').empty();
    }
}

$(() => {
    $('#nav-item-search').click((e) => {
        switch_to_search_form();
    });
    $('#nav-item-seed').click((e) => {
        switch_to_seed_form();
    });
    $('#nav-item-result').click((e) => {
        switch_to_result();
    });
    $('#ok-round').click((e) => {
        switch_to_poke_form();
    });
    $('#breadcrumb-round').click((e) => {
        switch_to_round_form();
    });
    $('#breadcrumb-poke').click((e) => {
        switch_to_poke_form();
    });
    $('#breadcrumb-entries').click((e) => {
        switch_to_entries_form();
    });
    $('#breadcrumb-id').click((e) => {
        switch_to_id_form();
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
