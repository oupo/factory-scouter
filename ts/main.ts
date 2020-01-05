import {POKEMON_NAMES, ITEM_NAMES, NATURE_NAMES, MOVE_NAMES} from './data';
import {PRNG} from './prng';
import {ALL_ENTRIES, Entry} from './entry';
import {FactoryHelper} from './factory-helper';
import {Predictor, PredictResultNode} from './predictor';

let POKEMON_NAME_TO_ID: { [key: string]: number; }= {};
POKEMON_NAMES.forEach((name, i) => {
    POKEMON_NAME_TO_ID[name] = i;
});

function create_svg() {
    return $("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'/>");
}

const WIDTH = 40;
const HEIGHT = 30;

function result_to_dom_node(result: PredictResultNode) {
    let svg = create_svg();
    let y = 0;
    let width = WIDTH * 3;
    let svg1 = entries_to_dom_node(result.chosen);
    svg1.setAttribute("y", String(y));
    svg.append(svg1);
    let n = result.children.length;
    addLine(svg.get(0), WIDTH * 3, HEIGHT / 2, WIDTH * 3 + 15, HEIGHT / 2);
    let lasty = 0;
    for (let i = 0; i < n; i ++) {
        let child = result.children[i];
        if (i > 0) addLine(svg.get(0), WIDTH * 3 + 7.5, y + HEIGHT / 2, WIDTH * 3 + 15, y + HEIGHT / 2);
        lasty = y + HEIGHT / 2;
        let svg2 = result_to_dom_node(child);
        svg2.setAttribute("x", String(WIDTH * 3 + 15));
        svg2.setAttribute("y", String(y));
        svg.append(svg2);
        width = Math.max(width, WIDTH * 3 + 15 + Number(svg2.getAttribute("width")));
        y += Math.max(HEIGHT, Number(svg2.getAttribute("height"))) + 5;
    }
    addLine(svg.get(0), WIDTH * 3 + 7.5, HEIGHT / 2, WIDTH * 3 + 7.5, lasty);

    svg.attr("width", width);
    svg.attr("height", Math.max(y, HEIGHT));
    return svg.get(0);
}

function addLine(svg: HTMLElement, x1: number, y1: number, x2: number, y2: number) {
    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("stroke", "#333");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
}

function entries_to_dom_node(entries: Entry[]) {
    let w = WIDTH * 3;
    let h = HEIGHT;
    let svg = create_svg().attr("width", w).attr("height", h).addClass("entries");
    svg.attr("data-entries", entries.map((x) => x.id).join(","));
    var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('height', String(h));
    rect.setAttribute('width', String(w));
    rect.setAttribute('rx', '10');
    rect.setAttribute('ry', '10');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('stroke-width', '1');
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

$("#result-box").empty().append(result_to_dom_node(Predictor.predict(new PRNG(0))[0]));
$("#result-box svg.entries").mouseenter((e) => {
    let svg = e.currentTarget;
    let ids = (svg.getAttribute("data-entries")).split(",").map(x => Number(x));
    $('#tooltip').remove();
    let $tooltip = $("<div id='tooltip' />");
    let $table = $("<table />");
    $tooltip.append($table);
    for (let id of ids) {
        let entry = ALL_ENTRIES[id];
        let pokemon = entry.pokemon;
        let item = entry.item;
        let nature = entry.nature;
        let $tr = $("<tr/>");
        $tr.append($("<td/>").append($("<img />").attr("src", pokemon_image_big(pokemon))));
        $tr.append($("<td/>").append($("<b />").text(POKEMON_NAMES[pokemon])).append($("<span/>").text(" " + ITEM_NAMES[item] + " " + NATURE_NAMES[nature] + " " + entry.effort))
        .append("<br/>").append($("<span />").text(entry.moves.map((x: number) => MOVE_NAMES[x]).join(" "))));
        $table.append($tr);
    }
    $("#result-box").append($tooltip);
    resize_tooltip(svg, $tooltip.get(0));
    $tooltip.mouseleave((e) => {
        if (!svg.contains(<Node>e.relatedTarget)) {
            $('#tooltip').hide();
        }
    });
}).mouseleave((e) => {
    let tooltip = $('#tooltip').get(0);
    if (!tooltip.contains(<Node>e.relatedTarget)) {
        $('#tooltip').hide();
    }
});

function resize_tooltip(button: HTMLElement, tooltip: HTMLElement) {
    let buttonRect = button.getBoundingClientRect();
    let tooltipRect = tooltip.getBoundingClientRect();
    $(tooltip).css("left", (buttonRect.left + window.scrollX) + "px");
    $(tooltip).css("top", (buttonRect.top + window.scrollY + buttonRect.height + 5) + "px");
}


function pokemon_image(id: number) {
    return `http://veekun.com/dex/media/pokemon/icons/${id}.png`;
}

function pokemon_image_big(id: number) {
    return `https://serebii.net/pokearth/sprites/dp/${String(id).padStart(3, "0")}.png`;
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
