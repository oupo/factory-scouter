/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./ts/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ts/data.ts":
/*!********************!*\
  !*** ./ts/data.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.POKEMON_NAMES = ["", "フシギダネ", "フシギソウ", "フシギバナ", "ヒトカゲ", "リザード", "リザードン", "ゼニガメ", "カメール", "カメックス", "キャタピー", "トランセル", "バタフリー", "ビードル", "コクーン", "スピアー", "ポッポ", "ピジョン", "ピジョット", "コラッタ", "ラッタ", "オニスズメ", "オニドリル", "アーボ", "アーボック", "ピカチュウ", "ライチュウ", "サンド", "サンドパン", "ニドラン♀", "ニドリーナ", "ニドクイン", "ニドラン♂", "ニドリーノ", "ニドキング", "ピッピ", "ピクシー", "ロコン", "キュウコン", "プリン", "プクリン", "ズバット", "ゴルバット", "ナゾノクサ", "クサイハナ", "ラフレシア", "パラス", "パラセクト", "コンパン", "モルフォン", "ディグダ", "ダグトリオ", "ニャース", "ペルシアン", "コダック", "ゴルダック", "マンキー", "オコリザル", "ガーディ", "ウインディ", "ニョロモ", "ニョロゾ", "ニョロボン", "ケーシィ", "ユンゲラー", "フーディン", "ワンリキー", "ゴーリキー", "カイリキー", "マダツボミ", "ウツドン", "ウツボット", "メノクラゲ", "ドククラゲ", "イシツブテ", "ゴローン", "ゴローニャ", "ポニータ", "ギャロップ", "ヤドン", "ヤドラン", "コイル", "レアコイル", "カモネギ", "ドードー", "ドードリオ", "パウワウ", "ジュゴン", "ベトベター", "ベトベトン", "シェルダー", "パルシェン", "ゴース", "ゴースト", "ゲンガー", "イワーク", "スリープ", "スリーパー", "クラブ", "キングラー", "ビリリダマ", "マルマイン", "タマタマ", "ナッシー", "カラカラ", "ガラガラ", "サワムラー", "エビワラー", "ベロリンガ", "ドガース", "マタドガス", "サイホーン", "サイドン", "ラッキー", "モンジャラ", "ガルーラ", "タッツー", "シードラ", "トサキント", "アズマオウ", "ヒトデマン", "スターミー", "バリヤード", "ストライク", "ルージュラ", "エレブー", "ブーバー", "カイロス", "ケンタロス", "コイキング", "ギャラドス", "ラプラス", "メタモン", "イーブイ", "シャワーズ", "サンダース", "ブースター", "ポリゴン", "オムナイト", "オムスター", "カブト", "カブトプス", "プテラ", "カビゴン", "フリーザー", "サンダー", "ファイヤー", "ミニリュウ", "ハクリュー", "カイリュー", "ミュウツー", "ミュウ", "チコリータ", "ベイリーフ", "メガニウム", "ヒノアラシ", "マグマラシ", "バクフーン", "ワニノコ", "アリゲイツ", "オーダイル", "オタチ", "オオタチ", "ホーホー", "ヨルノズク", "レディバ", "レディアン", "イトマル", "アリアドス", "クロバット", "チョンチー", "ランターン", "ピチュー", "ピィ", "ププリン", "トゲピー", "トゲチック", "ネイティ", "ネイティオ", "メリープ", "モココ", "デンリュウ", "キレイハナ", "マリル", "マリルリ", "ウソッキー", "ニョロトノ", "ハネッコ", "ポポッコ", "ワタッコ", "エイパム", "ヒマナッツ", "キマワリ", "ヤンヤンマ", "ウパー", "ヌオー", "エーフィ", "ブラッキー", "ヤミカラス", "ヤドキング", "ムウマ", "アンノーン", "ソーナンス", "キリンリキ", "クヌギダマ", "フォレトス", "ノコッチ", "グライガー", "ハガネール", "ブルー", "グランブル", "ハリーセン", "ハッサム", "ツボツボ", "ヘラクロス", "ニューラ", "ヒメグマ", "リングマ", "マグマッグ", "マグカルゴ", "ウリムー", "イノムー", "サニーゴ", "テッポウオ", "オクタン", "デリバード", "マンタイン", "エアームド", "デルビル", "ヘルガー", "キングドラ", "ゴマゾウ", "ドンファン", "ポリゴン2", "オドシシ", "ドーブル", "バルキー", "カポエラー", "ムチュール", "エレキッド", "ブビィ", "ミルタンク", "ハピナス", "ライコウ", "エンテイ", "スイクン", "ヨーギラス", "サナギラス", "バンギラス", "ルギア", "ホウオウ", "セレビィ", "キモリ", "ジュプトル", "ジュカイン", "アチャモ", "ワカシャモ", "バシャーモ", "ミズゴロウ", "ヌマクロー", "ラグラージ", "ポチエナ", "グラエナ", "ジグザグマ", "マッスグマ", "ケムッソ", "カラサリス", "アゲハント", "マユルド", "ドクケイル", "ハスボー", "ハスブレロ", "ルンパッパ", "タネボー", "コノハナ", "ダーテング", "スバメ", "オオスバメ", "キャモメ", "ペリッパー", "ラルトス", "キルリア", "サーナイト", "アメタマ", "アメモース", "キノココ", "キノガッサ", "ナマケロ", "ヤルキモノ", "ケッキング", "ツチニン", "テッカニン", "ヌケニン", "ゴニョニョ", "ドゴーム", "バクオング", "マクノシタ", "ハリテヤマ", "ルリリ", "ノズパス", "エネコ", "エネコロロ", "ヤミラミ", "クチート", "ココドラ", "コドラ", "ボスゴドラ", "アサナン", "チャーレム", "ラクライ", "ライボルト", "プラスル", "マイナン", "バルビート", "イルミーゼ", "ロゼリア", "ゴクリン", "マルノーム", "キバニア", "サメハダー", "ホエルコ", "ホエルオー", "ドンメル", "バクーダ", "コータス", "バネブー", "ブーピッグ", "パッチール", "ナックラー", "ビブラーバ", "フライゴン", "サボネア", "ノクタス", "チルット", "チルタリス", "ザングース", "ハブネーク", "ルナトーン", "ソルロック", "ドジョッチ", "ナマズン", "ヘイガニ", "シザリガー", "ヤジロン", "ネンドール", "リリーラ", "ユレイドル", "アノプス", "アーマルド", "ヒンバス", "ミロカロス", "ポワルン", "カクレオン", "カゲボウズ", "ジュペッタ", "ヨマワル", "サマヨール", "トロピウス", "チリーン", "アブソル", "ソーナノ", "ユキワラシ", "オニゴーリ", "タマザラシ", "トドグラー", "トドゼルガ", "パールル", "ハンテール", "サクラビス", "ジーランス", "ラブカス", "タツベイ", "コモルー", "ボーマンダ", "ダンバル", "メタング", "メタグロス", "レジロック", "レジアイス", "レジスチル", "ラティアス", "ラティオス", "カイオーガ", "グラードン", "レックウザ", "ジラーチ", "デオキシス", "ナエトル", "ハヤシガメ", "ドダイトス", "ヒコザル", "モウカザル", "ゴウカザル", "ポッチャマ", "ポッタイシ", "エンペルト", "ムックル", "ムクバード", "ムクホーク", "ビッパ", "ビーダル", "コロボーシ", "コロトック", "コリンク", "ルクシオ", "レントラー", "スボミー", "ロズレイド", "ズガイドス", "ラムパルド", "タテトプス", "トリデプス", "ミノムッチ", "ミノマダム", "ガーメイル", "ミツハニー", "ビークイン", "パチリス", "ブイゼル", "フローゼル", "チェリンボ", "チェリム", "カラナクシ", "トリトドン", "エテボース", "フワンテ", "フワライド", "ミミロル", "ミミロップ", "ムウマージ", "ドンカラス", "ニャルマー", "ブニャット", "リーシャン", "スカンプー", "スカタンク", "ドーミラー", "ドータクン", "ウソハチ", "マネネ", "ピンプク", "ペラップ", "ミカルゲ", "フカマル", "ガバイト", "ガブリアス", "ゴンベ", "リオル", "ルカリオ", "ヒポポタス", "カバルドン", "スコルピ", "ドラピオン", "グレッグル", "ドクロッグ", "マスキッパ", "ケイコウオ", "ネオラント", "タマンタ", "ユキカブリ", "ユキノオー", "マニューラ", "ジバコイル", "ベロベルト", "ドサイドン", "モジャンボ", "エレキブル", "ブーバーン", "トゲキッス", "メガヤンマ", "リーフィア", "グレイシア", "グライオン", "マンムー", "ポリゴンZ", "エルレイド", "ダイノーズ", "ヨノワール", "ユキメノコ", "ロトム", "ユクシー", "エムリット", "アグノム", "ディアルガ", "パルキア", "ヒードラン", "レジギガス", "ギラティナ", "クレセリア", "フィオネ", "マナフィ", "ダークライ", "シェイミ", "アルセウス"];


/***/ }),

/***/ "./ts/main.ts":
/*!********************!*\
  !*** ./ts/main.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = __webpack_require__(/*! ./data */ "./ts/data.ts");
var POKEMON_NAME_TO_ID = {};
data_1.POKEMON_NAMES.forEach(function (name, i) {
    POKEMON_NAME_TO_ID[name] = i;
});
console.log(POKEMON_NAME_TO_ID);
function pokemon_image(id) {
    return "http://veekun.com/dex/media/pokemon/icons/" + id + ".png";
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
$(function () {
    $('#ok-round').click(function (e) {
        switch_to_poke_form();
    });
    $('#breadcrumb-poke').click(function (e) {
        switch_to_poke_form();
    });
    $('#breadcrumb-round').click(function (e) {
        switch_to_round_form();
    });
    var _loop_1 = function (i) {
        $('#poke' + i).on('input', function (e) {
            var input = e.target;
            var name = input.value;
            if (name != "" && name in POKEMON_NAME_TO_ID) {
                var id = POKEMON_NAME_TO_ID[name];
                $("#pokeimg" + i).empty().append($('<img />').attr('src', pokemon_image(id)));
            }
            else {
                $("#pokeimg" + i).empty();
            }
        });
    };
    for (var i = 0; i < 6; i++) {
        _loop_1(i);
    }
});


/***/ })

/******/ });
//# sourceMappingURL=main.js.map