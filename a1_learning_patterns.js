/* Original graded A1 grammar: days 7-18. Method: see a pattern,
   close it, recall a fragment, then write a different complete sentence.
   Never reproduces other courses' copyrighted texts or tables. */
(function(){
'use strict';
const start=6;
const lessons=[
  {
    "title": "This, that и артикли",
    "rule": "This = «этот / это рядом», that = «тот / вон то». С одним исчисляемым предметом нужен определитель: a bag (какая-то сумка), an apple (какое-то яблоко). A ставится перед согласным звуком, an — перед гласным. Важно: это отличие английского от русского языка; нельзя просто пропустить a/an.",
    "words": "bag — сумка; ticket — билет; apple — яблоко. Порядок: this/that + is + a/an + предмет.",
    "rows": [
      [
        "Это ...",
        "This + is + ..."
      ],
      [
        "Вон то ...",
        "That + is + ..."
      ]
    ],
    "drill": [
      [
        "Начало фразы «Это ...»",
        "This is"
      ],
      [
        "Начало фразы «Вон то ...»",
        "That is"
      ]
    ]
  },
  {
    "title": "Один предмет и несколько",
    "rule": "A/an означает один неопределённый предмет. An apple, потому что слово apple начинается с гласного звука. Для нескольких обычно добавляем -s: one ticket → two tickets. Слово please делает просьбу вежливой.",
    "words": "one — один, two — два, ticket — билет, apple — яблоко, please — пожалуйста.",
    "rows": [
      [
        "Одно яблоко",
        "an + apple"
      ],
      [
        "Два билета",
        "two + tickets"
      ]
    ],
    "drill": [
      [
        "Артикль перед apple",
        "an"
      ],
      [
        "Два билета",
        "two tickets"
      ]
    ]
  },
  {
    "title": "One, two и окончание -s",
    "rule": "После one используем единственное число: one ticket. После two — множественное: two bags. В отрицаниях и вопросах порядок слов пока не меняем, тренируем количество.",
    "words": "ticket — билет; bag — сумка; one — один; two — два. Окончание -s делает многие существительные множественными.",
    "rows": [
      [
        "Один билет",
        "one + ticket"
      ],
      [
        "Две сумки",
        "two + bags"
      ]
    ],
    "drill": [
      [
        "Один билет",
        "one ticket"
      ],
      [
        "Две сумки",
        "two bags"
      ]
    ]
  },
  {
    "title": "Вопрос о предмете",
    "rule": "Для вопроса с is перенеси is в начало: This is ... → Is this ...?; That is ... → Is that ...? Ты уже менял порядок am/is/are в первой теме. Теперь применяем то же правило к this и that.",
    "words": "this = это; that = вон то; ticket = билет; apple = яблоко.",
    "rows": [
      [
        "Это ...",
        "This + is + ..."
      ],
      [
        "Это ...?",
        "Is + this + ...?"
      ],
      [
        "Вон то ...?",
        "Is + that + ...?"
      ]
    ],
    "drill": [
      [
        "Начни вопрос «Это ...?»",
        "Is this"
      ],
      [
        "Начни вопрос «Вон то ...?»",
        "Is that"
      ]
    ]
  },
  {
    "title": "Выбор a или an",
    "rule": "Перед одним предметом, если о нём говорим впервые, нужен a или an. Выбираем по ЗВУКУ: a bag, но an apple. В вопросе is остаётся в начале: Is this ...?",
    "words": "bag произносится с согласного звука; apple — с гласного. Сравни пары, не угадывай.",
    "rows": [
      [
        "Сумка",
        "a + bag"
      ],
      [
        "Яблоко",
        "an + apple"
      ]
    ],
    "drill": [
      [
        "Какой артикль нужен перед bag?",
        "a"
      ],
      [
        "Какой артикль нужен перед apple?",
        "an"
      ]
    ]
  },
  {
    "title": "Просьба о количестве",
    "rule": "Для вежливой короткой просьбы можно назвать количество и предмет, а затем please: one bag, please или two tickets, please. Перед one/two дополнительный a/an не нужен.",
    "words": "one/two обозначают количество; множественное число tickets, bags — с -s.",
    "rows": [
      [
        "Один предмет",
        "one + предмет"
      ],
      [
        "Два предмета",
        "two + множественное число"
      ],
      [
        "Вежливая просьба",
        "... + please"
      ]
    ],
    "drill": [
      [
        "Одна сумка",
        "one bag"
      ],
      [
        "Два билета",
        "two tickets"
      ]
    ]
  },
  {
    "title": "Где? и здесь есть",
    "rule": "Where is ...? значит «Где ...?». There is ... значит «Здесь есть / имеется ...» для одного предмета. The используется, когда речь об определённом месте: the hotel, the station. Here = здесь.",
    "words": "hotel = отель; station = станция; the = определённый артикль. С названиями обычных мест в вопросе употребляем the, когда имеется в виду нужное место.",
    "rows": [
      [
        "Где ...?",
        "Where + is + ...?"
      ],
      [
        "Здесь есть ...",
        "There + is + ..."
      ]
    ],
    "drill": [
      [
        "Начало вопроса «Где ...?»",
        "Where is"
      ],
      [
        "Начало «Здесь есть один ...»",
        "There is"
      ]
    ]
  },
  {
    "title": "Есть один предмет",
    "rule": "There is + a/an + существительное в единственном числе сообщает, что где-то есть один предмет. Is near = «находится рядом». Where is ...? используется для вопроса о местонахождении.",
    "words": "shop = магазин, near = рядом, hotel = отель, station = станция; эти слова объясняются до самостоятельного перевода.",
    "rows": [
      [
        "Здесь есть один ...",
        "There + is + a/an + ..."
      ],
      [
        "Рядом с ...",
        "near + ..."
      ]
    ],
    "drill": [
      [
        "Начало «Здесь есть ...»",
        "There is"
      ],
      [
        "Рядом (с чем-то)",
        "near"
      ]
    ]
  },
  {
    "title": "Описываем местоположение",
    "rule": "The station is near the hotel: связка is соединяет объект с его расположением. Near = «рядом», the обозначает конкретные места. Вопрос Where is ...? спрашивает, где находится объект.",
    "words": "station = станция; hotel = отель; airport = аэропорт; shop = магазин.",
    "rows": [
      [
        "Где объект?",
        "Where + is + ...?"
      ],
      [
        "Объект расположен рядом",
        "... + is + near + ..."
      ]
    ],
    "drill": [
      [
        "Начало вопроса «Где ...?»",
        "Where is"
      ],
      [
        "Рядом",
        "near"
      ]
    ]
  },
  {
    "title": "Where is my ...?",
    "rule": "My = мой/моя. В английском перед существительным с my второй артикль не нужен: my hotel, не my the hotel. В вопросе: Where is my ...? = «Где мой ...?».",
    "words": "my = мой / моя; hotel = отель; ticket = билет, here = здесь. Все эти слова либо ранее изучены, либо явно объяснены здесь.",
    "rows": [
      [
        "Где мой ...?",
        "Where + is + my + ...?"
      ],
      [
        "Находится здесь",
        "... + is + here"
      ]
    ],
    "drill": [
      [
        "Начало вопроса «Где мой ...?»",
        "Where is my"
      ],
      [
        "Здесь",
        "here"
      ]
    ]
  },
  {
    "title": "Повторяем места и вопросы",
    "rule": "Чтобы спросить о конкретном предмете: Where is my ...?; чтобы сказать, что здесь есть один предмет: There is a/an ... here. Не добавляй the после my.",
    "words": "my = мой; ticket = билет; airport = аэропорт; shop = магазин.",
    "rows": [
      [
        "Где мой ...?",
        "Where + is + my + ...?"
      ],
      [
        "Здесь есть ...",
        "There + is + a/an + ..."
      ]
    ],
    "drill": [
      [
        "Начало фразы «Здесь есть один ...»",
        "There is"
      ],
      [
        "Начало вопроса «Где мой ...?»",
        "Where is my"
      ]
    ]
  },
  {
    "title": "There are: несколько предметов",
    "rule": "There is + один предмет, но There are + несколько предметов. Пример построения: there are + two + stations + here. Окончание -s у stations показывает множественное число.",
    "words": "station = станция; two = два, here = здесь, near = рядом; все части изучены ранее.",
    "rows": [
      [
        "Один предмет",
        "There + is + ..."
      ],
      [
        "Несколько предметов",
        "There + are + ..."
      ]
    ],
    "drill": [
      [
        "Начало фразы «Здесь есть два ...»",
        "There are"
      ],
      [
        "Рядом",
        "near"
      ]
    ]
  }
];
function get(i){return Number.isInteger(i)&&i>=start&&i<start+lessons.length?lessons[i-start]:null}
function panel(i,escape,r){
 const u=get(i);if(!u)return '';
 const known=r?.formulaDrills||{},errors=r?.formulaMistakes||{};
 return '<div class="known-models graded-pattern">'+
 '<h3>Урок '+(i+1)+'. '+escape(u.title)+'</h3>'+
 '<p><b>Почему так:</b> '+escape(u.rule)+'</p>'+
 '<p><b>Нужные слова:</b> '+escape(u.words)+'</p>'+
 '<section class="formula-training"><h4>Схема построения</h4>'+
 '<p class="tiny">Сначала изучи схему. Затем сверни её и вспомни короткую часть самостоятельно. Полных ответов из перевода здесь нет.</p>'+
 '<details class="formula-help"><summary>Посмотреть схему</summary><div class="formula-grid">'+
 u.rows.map(row=>'<div class="formula-cell"><span>'+escape(row[0])+'</span><b lang="en">'+escape(row[1])+'</b></div>').join('')+
 '</div></details>'+
 u.drill.map((item,j)=>'<div class="formula-task"><span>'+escape(item[0])+'</span>'+
 (known[j]?'<span class="tiny" aria-label="Ответ проверен">✓ Верно</span>':
 '<div class="skill-inputrow"><input data-formula-input="'+j+'" spellcheck="false" autocomplete="off" '+
 'placeholder="Ответ на английском" aria-label="'+escape(item[0])+'. Напиши по-английски">'+
 '<button class="outline" data-formula-check="'+j+'">Проверить</button></div>'+
 (errors[j]?'<p class="tiny">Ответ пока неверен. Вернись к схеме и попробуй ещё раз.</p>':''))+
 '</div>').join('')+
 '</section></div>';
}
function audit(){
 const violations=[];
 for(let j=0;j<lessons.length;j++){
  const u=lessons[j],i=start+j,p=window.EJVariety.practice(i);
  for(const d of u.drill){
   if(!d[0]||!d[1])violations.push({i,missing:d});
   const clean=x=>String(x).toLowerCase().replace(/[.!?]+$/,'').trim();
   if(p.some(m=>clean(m.en)===clean(d[1])))violations.push({i,exactAnswer:d[1]});
  }
 }
 return violations;
}
window.EJA1Patterns={get,panel,audit,lessons};
})();