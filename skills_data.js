/* Original English Journey reading, grammar and dialogue tasks. Real-world recordings linked to VOA Learning English at original publisher. */
const SKILLS_DATA = [
 {
  "reading": {
   "kind": "Электронное письмо",
   "text": "Hi! My name is Mia and I am from Canada. I am 24 years old. I am in London for one week. My friend Amir is from Spain. He is a student. We are not in the same hotel, but we are close. My hotel is on King Street. Amir is in a small hostel next to the station. We meet for coffee at nine in the morning. I am happy to be here because I want to practise English. Please write to me. Where are you from? What is your name?",
   "questions": [
    {
     "q": "Where is Mia from?",
     "options": [
      "Canada",
      "Spain",
      "Italy"
     ],
     "answer": 0
    },
    {
     "q": "Why is Mia in London?",
     "options": [
      "For one week in the city",
      "To work in a bank",
      "To visit Canada"
     ],
     "answer": 0
    },
    {
     "q": "Where does Amir stay?",
     "options": [
      "Near the station",
      "At Mia’s hotel",
      "At the airport"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Я турист.",
    "en": "I am a tourist"
   },
   {
    "ru": "Она моя подруга.",
    "en": "She is my friend"
   },
   {
    "ru": "Ты из Испании?",
    "en": "Are you from Spain"
   }
  ],
  "dialogues": [
   {
    "title": "Знакомство в хостеле",
    "turns": [
     {
      "lead": "Собеседник: Hi! What is your name?",
      "choices": [
       "I am a table",
       "My name is Alex",
       "Good night, yesterday"
      ],
      "correct": 1,
      "answer": "My name is Alex"
     },
     {
      "lead": "Собеседник: Nice to meet you, Alex. Where are you from?",
      "choices": [
       "I am from Russia",
       "I have a blue bag",
       "It is on the left"
      ],
      "correct": 0,
      "answer": "I am from Russia"
     }
    ]
   },
   {
    "title": "Неправильно расслышали имя",
    "turns": [
     {
      "lead": "Собеседник: Is your name Alec?",
      "choices": [
       "Yes, I am a ticket",
       "No, my name is Alex",
       "Two coffees please"
      ],
      "correct": 1,
      "answer": "No, my name is Alex"
     },
     {
      "lead": "Собеседник: Could you spell it?",
      "choices": [
       "At the station",
       "A L E X",
       "I am hungry"
      ],
      "correct": 1,
      "answer": "A L E X"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 1",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",
   "questions": [
    {
     "q": "What is the woman’s name?",
     "options": [
      "Anna",
      "Marsha",
      "Amelia"
     ],
     "answer": 0
    },
    {
     "q": "Who welcomes her to the apartment?",
     "options": [
      "Pete",
      "Jonathan",
      "Caty"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Чек и покупка",
   "text": "CITY STATION TICKET OFFICE. Monday to Saturday, 08:00–20:00. One adult ticket to the museum: £8. Two adult tickets: £16. Children under twelve: £4. You can pay by card or cash. Please keep your receipt. The museum opens at 10:00 and closes at 17:00. Tickets for the museum are not valid on buses. If you need a bus ticket, buy it from the driver. Tickets cannot be returned after the date of your visit. Thank you for visiting our city!",
   "questions": [
    {
     "q": "How much are two adult museum tickets?",
     "options": [
      "£16",
      "£8",
      "£4"
     ],
     "answer": 0
    },
    {
     "q": "When does the museum open?",
     "options": [
      "At 10:00",
      "At 08:00",
      "At 20:00"
     ],
     "answer": 0
    },
    {
     "q": "Where can you buy a bus ticket?",
     "options": [
      "From the driver",
      "At the museum entrance",
      "At the hotel"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Это билет.",
    "en": "This is a ticket"
   },
   {
    "ru": "Два билета, пожалуйста.",
    "en": "Two tickets please"
   },
   {
    "ru": "Это яблоко.",
    "en": "This is an apple"
   }
  ],
  "dialogues": [
   {
    "title": "Покупка билета",
    "turns": [
     {
      "lead": "Кассир: How many tickets do you need?",
      "choices": [
       "Two tickets please",
       "I am from Canada",
       "Turn right"
      ],
      "correct": 0,
      "answer": "Two tickets please"
     },
     {
      "lead": "Кассир: Cash or card?",
      "choices": [
       "By card please",
       "The museum is nice",
       "She is late"
      ],
      "correct": 0,
      "answer": "By card please"
     }
    ]
   },
   {
    "title": "Цена другая",
    "turns": [
     {
      "lead": "Кассир: The ticket is fifteen pounds.",
      "choices": [
       "I bought coffee",
       "How much is it again",
       "Tomorrow morning"
      ],
      "correct": 1,
      "answer": "How much is it again"
     },
     {
      "lead": "Кассир: It is fifteen pounds. Would you like a receipt?",
      "choices": [
       "Go straight",
       "Yes please",
       "I do not work"
      ],
      "correct": 1,
      "answer": "Yes please"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 4",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-4/3168920.html",
   "questions": [
    {
     "q": "What does Anna look for in her bag?",
     "options": [
      "A pen",
      "A passport",
      "A key"
     ],
     "answer": 0
    },
    {
     "q": "What does Marsha find in the bag?",
     "options": [
      "A map",
      "A ticket",
      "A phone"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Указатель и сообщение",
   "text": "WELCOME TO RIVER TOWN. The train station is next to the bus stop on Park Road. The tourist information centre is opposite the station. The museum is behind the information centre. To get to the hotel, walk straight along Park Road and turn left at the bank. The hotel is on the right, next to a small supermarket. There is a pharmacy across from the hotel. The town library is open every day except Sunday. You can get a free map at the information centre.",
   "questions": [
    {
     "q": "Where is the information centre?",
     "options": [
      "Opposite the station",
      "Inside the museum",
      "Next to the hotel"
     ],
     "answer": 0
    },
    {
     "q": "What is next to the hotel?",
     "options": [
      "A supermarket",
      "The library",
      "The bus stop"
     ],
     "answer": 0
    },
    {
     "q": "Where can visitors get a map?",
     "options": [
      "At the information centre",
      "At the pharmacy",
      "At the bank"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Где находится отель?",
    "en": "Where is the hotel"
   },
   {
    "ru": "Здесь есть магазин.",
    "en": "There is a shop here"
   },
   {
    "ru": "Рядом со станцией есть отель.",
    "en": "There is a hotel near the station"
   }
  ],
  "dialogues": [
   {
    "title": "Ищем отель",
    "turns": [
     {
      "lead": "Прохожий: Can I help you?",
      "choices": [
       "Where is the hotel",
       "I need two soups",
       "It is my brother"
      ],
      "correct": 0,
      "answer": "Where is the hotel"
     },
     {
      "lead": "Прохожий: It is near the bank.",
      "choices": [
       "Did you buy it",
       "Thank you very much",
       "It is raining"
      ],
      "correct": 1,
      "answer": "Thank you very much"
     }
    ]
   },
   {
    "title": "Заблудились",
    "turns": [
     {
      "lead": "Прохожий: Are you looking for something?",
      "choices": [
       "I cannot find the station",
       "I will have tea",
       "This is my key"
      ],
      "correct": 0,
      "answer": "I cannot find the station"
     },
     {
      "lead": "Прохожий: Go straight and turn left.",
      "choices": [
       "I was happy",
       "Could you repeat that please",
       "I am a ticket"
      ],
      "correct": 1,
      "answer": "Could you repeat that please"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 10",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-10/3285228.html",
   "questions": [
    {
     "q": "Who is visiting Anna?",
     "options": [
      "Ashley",
      "Marsha",
      "Anne"
     ],
     "answer": 0
    },
    {
     "q": "Anna’s apartment is near which Metro station?",
     "options": [
      "Columbia Heights",
      "Airport",
      "Union Station"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Меню кафе",
   "text": "SUNNY CAFE — TODAY’S MENU. Breakfast (until 11:00): eggs and toast £6; tea £2; orange juice £3. Lunch (11:30–15:00): chicken sandwich £7; vegetable soup £6; salad £8. A bottle of water is £2 all day. Please tell our staff about food allergies before you order. Our vegetarian soup does not contain meat. Card payments are accepted. If you want the bill, please ask your waiter. We are closed on Sunday but open from Monday to Saturday.",
   "questions": [
    {
     "q": "Which item is vegetarian?",
     "options": [
      "Vegetable soup",
      "Chicken sandwich",
      "Eggs and toast"
     ],
     "answer": 0
    },
    {
     "q": "How much is water?",
     "options": [
      "£2",
      "£3",
      "£7"
     ],
     "answer": 0
    },
    {
     "q": "When is the café closed?",
     "options": [
      "Sunday",
      "Saturday",
      "Monday"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Можно мне меню?",
    "en": "Can I have the menu"
   },
   {
    "ru": "Я хотел бы кофе.",
    "en": "I would like a coffee"
   },
   {
    "ru": "Можно счёт, пожалуйста?",
    "en": "Can I have the bill please"
   }
  ],
  "dialogues": [
   {
    "title": "Заказываем обед",
    "turns": [
     {
      "lead": "Официант: What would you like?",
      "choices": [
       "I would like a sandwich",
       "Where is my train",
       "I lost my suitcase"
      ],
      "correct": 0,
      "answer": "I would like a sandwich"
     },
     {
      "lead": "Официант: Anything to drink?",
      "choices": [
       "Water please",
       "A bus ticket",
       "At the museum"
      ],
      "correct": 0,
      "answer": "Water please"
     }
    ]
   },
   {
    "title": "Есть аллергия",
    "turns": [
     {
      "lead": "Официант: What can I get you?",
      "choices": [
       "Do you have vegetarian soup",
       "I am a pilot",
       "Go up the stairs"
      ],
      "correct": 0,
      "answer": "Do you have vegetarian soup"
     },
     {
      "lead": "Официант: Yes, we do.",
      "choices": [
       "I work at home",
       "Does it contain milk",
       "Yesterday was Sunday"
      ],
      "correct": 1,
      "answer": "Does it contain milk"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 5",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-5-where-are-you/3168971.html",
   "questions": [
    {
     "q": "Where does Anna say people cook?",
     "options": [
      "In the kitchen",
      "In the bathroom",
      "In the bedroom"
     ],
     "answer": 0
    },
    {
     "q": "Where does Marsha say people sleep?",
     "options": [
      "In the bedroom",
      "In the kitchen",
      "In the living room"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Распорядок дня",
   "text": "My name is Daniel. I live in Manchester and work in a small shop. I wake up at seven every day, but I do not start work until nine. I usually drink tea and eat toast for breakfast. I walk to work because the shop is near my house. I have lunch at one. My sister works in a hospital and sometimes comes to the shop after work. On Fridays I study English online. At the weekend I do not work. I visit my parents or play football with friends. I never work on Sunday.",
   "questions": [
    {
     "q": "What time does Daniel start work?",
     "options": [
      "At nine",
      "At seven",
      "At one"
     ],
     "answer": 0
    },
    {
     "q": "How does he get to work?",
     "options": [
      "He walks",
      "He takes a taxi",
      "He takes a bus"
     ],
     "answer": 0
    },
    {
     "q": "When does he study English?",
     "options": [
      "On Fridays",
      "Every Sunday",
      "On Mondays"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Она работает каждый день.",
    "en": "She works every day"
   },
   {
    "ru": "Я не пью чай.",
    "en": "I do not drink tea"
   },
   {
    "ru": "Они живут в Лондоне.",
    "en": "They live in London"
   }
  ],
  "dialogues": [
   {
    "title": "Рассказываем о привычках",
    "turns": [
     {
      "lead": "Собеседник: What do you do in the morning?",
      "choices": [
       "I usually drink tea",
       "I was at the beach yesterday",
       "Go that way"
      ],
      "correct": 0,
      "answer": "I usually drink tea"
     },
     {
      "lead": "Собеседник: Do you work in the evening?",
      "choices": [
       "No, I work during the day",
       "I am from Italy",
       "Two pounds"
      ],
      "correct": 0,
      "answer": "No, I work during the day"
     }
    ]
   },
   {
    "title": "Меняем распорядок",
    "turns": [
     {
      "lead": "Собеседник: Are you free on Saturday?",
      "choices": [
       "I have two passports",
       "Yes, I do not work on Saturday",
       "She is a sandwich"
      ],
      "correct": 1,
      "answer": "Yes, I do not work on Saturday"
     },
     {
      "lead": "Собеседник: Shall we meet in the morning?",
      "choices": [
       "Near the train",
       "I was there",
       "Yes, that sounds good"
      ],
      "correct": 2,
      "answer": "Yes, that sounds good"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 8",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-8-are-you-busy/3253185.html",
   "questions": [
    {
     "q": "What is Anne doing at work?",
     "options": [
      "Writing",
      "Cooking",
      "Swimming"
     ],
     "answer": 0
    },
    {
     "q": "What do Anna’s colleagues prepare?",
     "options": [
      "A surprise party",
      "A school test",
      "A train trip"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Расписание транспорта",
   "text": "CITY EXPRESS. Train 204 leaves at 09:10 and arrives at 10:05. Train 206 leaves at 11:30 and arrives at 12:25. There is no train at 10:30. On Sunday, only Train 206 runs. A return ticket costs £18 and a single ticket costs £11. Please arrive ten minutes before departure. Platform 4 is for trains to Oxford. Passengers with bicycles must use the last carriage. For information about delays, check the station display or ask a member of staff.",
   "questions": [
    {
     "q": "When does Train 204 leave?",
     "options": [
      "09:10",
      "10:05",
      "11:30"
     ],
     "answer": 0
    },
    {
     "q": "Which train runs on Sunday?",
     "options": [
      "206 only",
      "204 only",
      "Both trains"
     ],
     "answer": 0
    },
    {
     "q": "How much is a return ticket?",
     "options": [
      "£18",
      "£11",
      "£10"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Ты часто путешествуешь?",
    "en": "Do you travel often"
   },
   {
    "ru": "Она любит кофе?",
    "en": "Does she like coffee"
   },
   {
    "ru": "Я иногда езжу на автобусе.",
    "en": "I sometimes take the bus"
   }
  ],
  "dialogues": [
   {
    "title": "Выбираем транспорт",
    "turns": [
     {
      "lead": "Собеседник: Do you travel often?",
      "choices": [
       "Yes, I sometimes travel by train",
       "I drank some tea",
       "I am cooking now"
      ],
      "correct": 0,
      "answer": "Yes, I sometimes travel by train"
     },
     {
      "lead": "Собеседник: Do you take a taxi?",
      "choices": [
       "The ticket is blue",
       "No, I usually take the bus",
       "I will sleep later"
      ],
      "correct": 1,
      "answer": "No, I usually take the bus"
     }
    ]
   },
   {
    "title": "Пропустили автобус",
    "turns": [
     {
      "lead": "Собеседник: Do buses run on Sunday?",
      "choices": [
       "I have three rooms",
       "Yes, but not very often",
       "The salad is delicious"
      ],
      "correct": 1,
      "answer": "Yes, but not very often"
     },
     {
      "lead": "Собеседник: Would you like a taxi?",
      "choices": [
       "We visited London",
       "She was late",
       "Yes please"
      ],
      "correct": 2,
      "answer": "Yes please"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 11",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-11-this-is-my-neighborhood/3293986.html",
   "questions": [
    {
     "q": "Where does Anna return her books?",
     "options": [
      "At a library",
      "At a bank",
      "At a hotel"
     ],
     "answer": 0
    },
    {
     "q": "What does Anna need to buy for her letters?",
     "options": [
      "Stamps",
      "Tickets",
      "Batteries"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Подтверждение бронирования",
   "text": "HOTEL RESERVATION — CONFIRMED. Guest: Alex Green. Check-in: Friday, 14 May after 15:00. Check-out: Monday, 17 May before 11:00. Room: one double room for two people. Breakfast is included. Price: £90 per night. The hotel is opposite the city park. Free Wi-Fi is available in every room. Please show your passport at reception. If you arrive after 22:00, call the hotel. You may cancel free of charge until two days before arrival. The room has a shower but no bath.",
   "questions": [
    {
     "q": "What type of room is booked?",
     "options": [
      "A double room",
      "A single room",
      "A family apartment"
     ],
     "answer": 0
    },
    {
     "q": "Is breakfast included?",
     "options": [
      "Yes",
      "No",
      "Only on Sunday"
     ],
     "answer": 0
    },
    {
     "q": "What must Alex show at reception?",
     "options": [
      "A passport",
      "A bus ticket",
      "A train card"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "У меня есть бронирование.",
    "en": "I have a reservation"
   },
   {
    "ru": "У неё есть ключ.",
    "en": "She has a key"
   },
   {
    "ru": "Это мой чемодан.",
    "en": "This is my suitcase"
   }
  ],
  "dialogues": [
   {
    "title": "Заселение",
    "turns": [
     {
      "lead": "Администратор: Do you have a reservation?",
      "choices": [
       "She visited a museum",
       "Yes, I have a reservation",
       "Turn left"
      ],
      "correct": 1,
      "answer": "Yes, I have a reservation"
     },
     {
      "lead": "Администратор: May I see your passport?",
      "choices": [
       "Here is my passport",
       "I am a train",
       "It is expensive"
      ],
      "correct": 0,
      "answer": "Here is my passport"
     }
    ]
   },
   {
    "title": "Нет нужного ключа",
    "turns": [
     {
      "lead": "Администратор: What is the problem?",
      "choices": [
       "My room key does not work",
       "I am a tourist",
       "Coffee is hot"
      ],
      "correct": 0,
      "answer": "My room key does not work"
     },
     {
      "lead": "Администратор: I am sorry. Would you like a new key?",
      "choices": [
       "I am reading",
       "Two tickets",
       "Yes please"
      ],
      "correct": 2,
      "answer": "Yes please"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 2",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-2-hello/3113733.html",
   "questions": [
    {
     "q": "Where is Jonathan’s apartment?",
     "options": [
      "B4",
      "C2",
      "D7"
     ],
     "answer": 0
    },
    {
     "q": "Who is Anna’s roommate?",
     "options": [
      "Marsha",
      "Ashley",
      "Amelia"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Сообщения в чате",
   "text": "NORA (14:05): Hi, Ben! I am waiting outside the museum. Where are you? BEN (14:06): Sorry, I am on the bus now. It is moving slowly because there is a lot of traffic. NORA (14:07): No problem. I am sitting in the café next to the museum. BEN (14:12): I am getting off the bus. I can see the museum. NORA (14:13): Great! I am wearing a blue jacket and reading a book. BEN (14:14): I see you. I am coming over now.",
   "questions": [
    {
     "q": "Where is Nora waiting at the end?",
     "options": [
      "In the café",
      "On the bus",
      "Inside the museum"
     ],
     "answer": 0
    },
    {
     "q": "Why is Ben late?",
     "options": [
      "Traffic is slow",
      "He is asleep",
      "The café is closed"
     ],
     "answer": 0
    },
    {
     "q": "What is Nora doing at 14:13?",
     "options": [
      "Reading a book",
      "Driving a car",
      "Buying tickets"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Я сейчас жду автобус.",
    "en": "I am waiting for a bus now"
   },
   {
    "ru": "Она читает.",
    "en": "She is reading"
   },
   {
    "ru": "Ты ищешь такси?",
    "en": "Are you looking for a taxi"
   }
  ],
  "dialogues": [
   {
    "title": "Что происходит сейчас",
    "turns": [
     {
      "lead": "Собеседник: What are you doing?",
      "choices": [
       "I am waiting for a bus",
       "I was in Rome",
       "I have three keys"
      ],
      "correct": 0,
      "answer": "I am waiting for a bus"
     },
     {
      "lead": "Собеседник: Is the bus coming?",
      "choices": [
       "Yes, it is coming now",
       "Yesterday I slept",
       "Near the supermarket"
      ],
      "correct": 0,
      "answer": "Yes, it is coming now"
     }
    ]
   },
   {
    "title": "Водитель опаздывает",
    "turns": [
     {
      "lead": "Собеседник: Where is your taxi?",
      "choices": [
       "She works in a bank",
       "I am looking for it",
       "That is an apple"
      ],
      "correct": 1,
      "answer": "I am looking for it"
     },
     {
      "lead": "Собеседник: Is the driver calling you?",
      "choices": [
       "Yes, he is calling me",
       "Two sandwiches",
       "I went to Italy"
      ],
      "correct": 0,
      "answer": "Yes, he is calling me"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 7",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-7-what-are-you-doing/3240468.html",
   "questions": [
    {
     "q": "What is Anne doing?",
     "options": [
      "Writing",
      "Swimming",
      "Sleeping"
     ],
     "answer": 0
    },
    {
     "q": "What is Amelia doing?",
     "options": [
      "Reading",
      "Cooking",
      "Driving"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "История о поездке",
   "text": "Yesterday I visited York with two friends. We travelled by train from Leeds and arrived at ten o’clock. The weather was cold but sunny. First we walked through the old city centre. Then we visited a small museum. It was interesting, but the museum café was closed. We had lunch in a restaurant near the river. I ordered soup and bread. My friends ordered sandwiches. In the afternoon we bought postcards and took photos. We returned home at six. It was a very good day.",
   "questions": [
    {
     "q": "How did they travel?",
     "options": [
      "By train",
      "By car",
      "By plane"
     ],
     "answer": 0
    },
    {
     "q": "Why did they eat outside the museum?",
     "options": [
      "The museum café was closed",
      "They missed the train",
      "It was raining"
     ],
     "answer": 0
    },
    {
     "q": "When did they return home?",
     "options": [
      "At six",
      "At ten",
      "At noon"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Вчера я был в отеле.",
    "en": "I was at the hotel yesterday"
   },
   {
    "ru": "Мы посетили музей.",
    "en": "We visited a museum"
   },
   {
    "ru": "Они опоздали.",
    "en": "They were late"
   }
  ],
  "dialogues": [
   {
    "title": "Вспоминаем поездку",
    "turns": [
     {
      "lead": "Собеседник: Where were you yesterday?",
      "choices": [
       "I was at the museum",
       "I am reading now",
       "My name is Ana"
      ],
      "correct": 0,
      "answer": "I was at the museum"
     },
     {
      "lead": "Собеседник: Did you enjoy it?",
      "choices": [
       "Two tickets",
       "Yes, it was interesting",
       "She is studying"
      ],
      "correct": 1,
      "answer": "Yes, it was interesting"
     }
    ]
   },
   {
    "title": "Кафе было закрыто",
    "turns": [
     {
      "lead": "Собеседник: Was the café open?",
      "choices": [
       "Yes, I am a tourist",
       "No, it was closed",
       "I will call tomorrow"
      ],
      "correct": 1,
      "answer": "No, it was closed"
     },
     {
      "lead": "Собеседник: What did you do?",
      "choices": [
       "We had lunch near the river",
       "He is driving",
       "That is a map"
      ],
      "correct": 0,
      "answer": "We had lunch near the river"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 9",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-9-is-it-cold/3261789.html",
   "questions": [
    {
     "q": "What city is Anna in?",
     "options": [
      "Washington, D.C.",
      "London",
      "Mexico City"
     ],
     "answer": 0
    },
    {
     "q": "What does Anna forget to check?",
     "options": [
      "The correct city forecast",
      "The museum price",
      "The train time"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Потерянная вещь",
   "text": "LOST PROPERTY REPORT. I lost my black backpack on Tuesday evening. I was on bus 42 from the airport to the city centre. I had my backpack when I bought the ticket, but I could not find it when I arrived at the hotel. The bag contained a blue sweater, a guidebook and my phone charger. It did not contain money or a passport. I called the bus company yesterday. They found a black bag, but it was not mine. Please call me if another black backpack is found. My name is Emma Lee.",
   "questions": [
    {
     "q": "Where did Emma probably lose the bag?",
     "options": [
      "On a bus",
      "In the hotel room",
      "At a museum"
     ],
     "answer": 0
    },
    {
     "q": "What was inside the bag?",
     "options": [
      "A charger",
      "A passport",
      "Cash"
     ],
     "answer": 0
    },
    {
     "q": "Did the bus company find her bag?",
     "options": [
      "No",
      "Yes",
      "They do not answer calls"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Я потерял билет.",
    "en": "I lost my ticket"
   },
   {
    "ru": "Ты видел автобус?",
    "en": "Did you see the bus"
   },
   {
    "ru": "Она купила билет.",
    "en": "She bought a ticket"
   }
  ],
  "dialogues": [
   {
    "title": "Пропал билет",
    "turns": [
     {
      "lead": "Сотрудник: What happened?",
      "choices": [
       "I lost my ticket",
       "I am from Spain",
       "I am eating"
      ],
      "correct": 0,
      "answer": "I lost my ticket"
     },
     {
      "lead": "Сотрудник: Where did you have it?",
      "choices": [
       "I have a room",
       "I had it at the station",
       "She studies often"
      ],
      "correct": 1,
      "answer": "I had it at the station"
     }
    ]
   },
   {
    "title": "Нашли телефон",
    "turns": [
     {
      "lead": "Сотрудник: Did you find your phone?",
      "choices": [
       "A taxi please",
       "She is waiting",
       "Yes, I found it"
      ],
      "correct": 2,
      "answer": "Yes, I found it"
     },
     {
      "lead": "Сотрудник: Where was it?",
      "choices": [
       "It was in my bag",
       "I will study",
       "At six tomorrow"
      ],
      "correct": 0,
      "answer": "It was in my bag"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 12",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-12-meet-my-family/3301733.html",
   "questions": [
    {
     "q": "How does Anna feel about her family?",
     "options": [
      "Homesick",
      "Angry",
      "Very hungry"
     ],
     "answer": 0
    },
    {
     "q": "What do Anna’s parents do?",
     "options": [
      "They are rodeo clowns",
      "They are pilots",
      "They are teachers"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "План поездки",
   "text": "WEEKEND TRIP PLAN. On Saturday morning I am going to book a train to Brighton. My friend Sam is going to find a small hotel near the beach. We will leave London at eight on Sunday and arrive before ten. We are going to walk along the beach and visit the pier. Sam wants to swim, but I think the water will be cold. After lunch we will look for a café with sea views. We will take the evening train home. If the weather is bad, we are going to visit a museum instead.",
   "questions": [
    {
     "q": "Who will find the hotel?",
     "options": [
      "Sam",
      "The narrator’s brother",
      "A travel agent"
     ],
     "answer": 0
    },
    {
     "q": "When are they leaving London?",
     "options": [
      "Sunday morning",
      "Saturday evening",
      "Monday morning"
     ],
     "answer": 0
    },
    {
     "q": "What will they do if the weather is bad?",
     "options": [
      "Visit a museum",
      "Go swimming",
      "Cancel all travel"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Я собираюсь забронировать отель.",
    "en": "I am going to book a hotel"
   },
   {
    "ru": "Я вызову такси.",
    "en": "I will call a taxi"
   },
   {
    "ru": "Завтра мы поедем на поезде.",
    "en": "We are going to travel by train tomorrow"
   }
  ],
  "dialogues": [
   {
    "title": "Планируем поездку",
    "turns": [
     {
      "lead": "Собеседник: What are you going to do?",
      "choices": [
       "I am going to book a flight",
       "I was late yesterday",
       "I am hungry"
      ],
      "correct": 0,
      "answer": "I am going to book a flight"
     },
     {
      "lead": "Собеседник: When are you leaving?",
      "choices": [
       "She is a teacher",
       "A museum ticket",
       "I am leaving tomorrow"
      ],
      "correct": 2,
      "answer": "I am leaving tomorrow"
     }
    ]
   },
   {
    "title": "Поездка изменилась",
    "turns": [
     {
      "lead": "Собеседник: The flight is full. What will you do?",
      "choices": [
       "It is under the table",
       "I will take the train",
       "I am reading"
      ],
      "correct": 1,
      "answer": "I will take the train"
     },
     {
      "lead": "Собеседник: Shall I book it?",
      "choices": [
       "I like coffee",
       "The station is there",
       "Yes please"
      ],
      "correct": 2,
      "answer": "Yes please"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 3",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-3-i-am-here/3126527.html",
   "questions": [
    {
     "q": "What does Anna want to cook?",
     "options": [
      "Dinner",
      "Breakfast",
      "Lunch"
     ],
     "answer": 0
    },
    {
     "q": "Where is the supermarket according to Marsha?",
     "options": [
      "1500 Irving Street",
      "The airport",
      "The gym"
     ],
     "answer": 0
    }
   ]
  }
 },
 {
  "reading": {
   "kind": "Объявление об изменении рейса",
   "text": "AIRLINE NOTICE. Flight AB218 to Madrid is delayed by two hours because of bad weather. The new departure time is 18:40, not 16:40. The gate has changed from Gate 5 to Gate 9. Please do not go to the original gate. If you have a connecting flight, speak to a member of staff at the information desk. Passengers who need assistance may ask at Gate 9. Keep your boarding pass. We are sorry for the delay. The flight is not cancelled, and tickets are still valid.",
   "questions": [
    {
     "q": "What is the new departure time?",
     "options": [
      "18:40",
      "16:40",
      "09:00"
     ],
     "answer": 0
    },
    {
     "q": "Which gate should passengers use?",
     "options": [
      "Gate 9",
      "Gate 5",
      "Gate 18"
     ],
     "answer": 0
    },
    {
     "q": "Is the flight cancelled?",
     "options": [
      "No",
      "Yes",
      "Only for connecting passengers"
     ],
     "answer": 0
    }
   ]
  },
  "grammar": [
   {
    "ru": "Мой рейс задержан.",
    "en": "My flight is delayed"
   },
   {
    "ru": "Я не могу найти отель.",
    "en": "I cannot find the hotel"
   },
   {
    "ru": "Можете повторить помедленнее?",
    "en": "Could you repeat that more slowly"
   }
  ],
  "dialogues": [
   {
    "title": "Рейс задержан",
    "turns": [
     {
      "lead": "Сотрудник: Can I help you?",
      "choices": [
       "My flight is delayed",
       "I am from Ireland",
       "That is my bag"
      ],
      "correct": 0,
      "answer": "My flight is delayed"
     },
     {
      "lead": "Сотрудник: Do you need another connection?",
      "choices": [
       "I am reading a map",
       "Yes, I need help",
       "I go to school"
      ],
      "correct": 1,
      "answer": "Yes, I need help"
     }
    ]
   },
   {
    "title": "Отмена рейса",
    "turns": [
     {
      "lead": "Сотрудник: Your flight is cancelled.",
      "choices": [
       "I live in London",
       "We were late",
       "Can I get a refund"
      ],
      "correct": 2,
      "answer": "Can I get a refund"
     },
     {
      "lead": "Сотрудник: Yes, we can help with that.",
      "choices": [
       "Thank you for your help",
       "Two apples please",
       "I am sleeping"
      ],
      "correct": 0,
      "answer": "Thank you for your help"
     }
    ]
   }
  ],
  "audio": {
   "title": "VOA Learning English — Lesson 6",
   "url": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-6-where-is-the-gym/3225958.html",
   "questions": [
    {
     "q": "Where is the gym?",
     "options": [
      "Across from the lounge",
      "Inside the garage",
      "On the rooftop"
     ],
     "answer": 0
    },
    {
     "q": "Who gives Anna directions?",
     "options": [
      "Pete",
      "Marsha",
      "Ashley"
     ],
     "answer": 0
    }
   ]
  }
 }
];
