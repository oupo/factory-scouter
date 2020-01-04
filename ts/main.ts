import {POKEMON_NAMES} from './data';
import {PRNG} from './prng';
import {Entry} from './entry';
import {FactoryHelper} from './factory-helper';
import {Predictor, PredictResultNode} from './predictor';

let POKEMON_NAME_TO_ID: { [key: string]: number; }= {};
POKEMON_NAMES.forEach((name, i) => {
    POKEMON_NAME_TO_ID[name] = i;
});

function create_svg() {
    return $("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'/>");
}

function result_to_dom_node(result: PredictResultNode[]) {
    let svg = create_svg();
    let y = 0;
    let width = 0;
    for (let res of result) {
        let svg1 = entries_to_dom_node(res.chosen);
        svg1.setAttribute("y", String(y));
        svg.append(svg1);
        let svg2 = result_to_dom_node(res.children);
        svg2.setAttribute("x", String(WIDTH * 3 + 15));
        svg2.setAttribute("y", String(y));
        svg.append(svg2);
        width = Math.max(width, WIDTH * 3 + 15 + Number(svg2.getAttribute("width")));
        y += Math.max(HEIGHT, Number(svg2.getAttribute("height"))) + 5;
    }
    svg.attr("width", width);
    svg.attr("height", y);
    return svg.get(0);
}

const WIDTH = 40;
const HEIGHT = 30;

function entries_to_dom_node(entries: Entry[]) {
    let w = WIDTH * 3;
    let h = HEIGHT;
    let svg = create_svg().attr("width", w).attr("height", h);
    var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('height', String(h));
    rect.setAttribute('width', String(w));
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('style', 'fill: #cccccc');
    svg.append(rect);
    for (let i = 0; i < entries.length; i ++) {
        var image = document.createElementNS('http://www.w3.org/2000/svg','image');
        image.setAttribute('height', String(HEIGHT));
        image.setAttribute('width', String(WIDTH));
        image.setAttributeNS('http://www.w3.org/1999/xlink','href',pokemon_image(entries[i].pokemon));
        image.setAttribute('x', String(WIDTH * i));
        image.setAttribute('y', '0');
        svg.append(image);
    }
    return svg.get(0);
}

$("#result-box").empty().append(result_to_dom_node(Predictor.predict(new PRNG(0))));

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
