(function(window) {
    'use strict';
    var tmCtrl;

    window.setInterval(function sendTwit() {
        console.log('sendTwit()');
        if (!tmCtrl) {
            tmCtrl = new timeline.controller();
        }
        var basicTweet = {
            "created_at": "Mon Aug 11 11:22:19 +0000 2014",
            "id": 498791517117759500,
            "id_str": "498791517117759488",
            "text": "Como son incapaces de hacer respetar las señales de tráfico, las anulan. Sólo pasa en #Aranda http://t.co/L9hnaEY5ZA",
            "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>",
            "truncated": false,
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "user": {
                "id": 278738788,
                "id_str": "278738788",
                "name": "Antonio Miguel",
                "screen_name": "ADuero",
                "location": "A orillas del Duero.",
                "description": "Nací de izquierdas hace poco más de medio siglo. Sigo considerándome de izquierdas.",
                "url": null,
                "entities": {
                    "description": {
                        "urls": []
                    }
                },
                "protected": false,
                "followers_count": 213,
                "friends_count": 200,
                "listed_count": 5,
                "created_at": "Thu Apr 07 21:43:41 +0000 2011",
                "favourites_count": 323,
                "utc_offset": 7200,
                "time_zone": "Madrid",
                "geo_enabled": false,
                "verified": false,
                "statuses_count": 3515,
                "lang": "es",
                "contributors_enabled": false,
                "is_translator": false,
                "is_translation_enabled": false,
                "profile_background_color": "642D8B",
                "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/315097105/P8070057.JPG",
                "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/315097105/P8070057.JPG",
                "profile_background_tile": true,
                "profile_image_url": "http://pbs.twimg.com/profile_images/378800000644762271/379432873c4e9166baf16be3596bff23_normal.jpeg",
                "profile_image_url_https": "https://pbs.twimg.com/profile_images/378800000644762271/379432873c4e9166baf16be3596bff23_normal.jpeg",
                "profile_banner_url": "https://pbs.twimg.com/profile_banners/278738788/1401701668",
                "profile_link_color": "F00E0E",
                "profile_sidebar_border_color": "FFFFFF",
                "profile_sidebar_fill_color": "E9EFF2",
                "profile_text_color": "3D1957",
                "profile_use_background_image": true,
                "default_profile": false,
                "default_profile_image": false,
                "following": true,
                "follow_request_sent": false,
                "notifications": false
            },
            "geo": null,
            "coordinates": null,
            "place": null,
            "contributors": null,
            "retweet_count": 0,
            "favorite_count": 0,
            "entities": {
                "hashtags": [
                {
                    "text": "Aranda",
                    "indices": [
                    86,
                    93
                    ]
                }
                ],
                "symbols": [],
                "urls": [],
                "user_mentions": [],
                "media": [
                {
                    "id": 498791445369585660,
                    "id_str": "498791445369585665",
                    "indices": [
                    94,
                    116
                    ],
                    "media_url": "http://pbs.twimg.com/media/BuwQLUZCAAETYWx.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/BuwQLUZCAAETYWx.jpg",
                    "url": "http://t.co/L9hnaEY5ZA",
                    "display_url": "pic.twitter.com/L9hnaEY5ZA",
                    "expanded_url": "http://twitter.com/ADuero/status/498791517117759488/photo/1",
                    "type": "photo",
                    "sizes": {
                        "medium": {
                            "w": 600,
                            "h": 450,
                            "resize": "fit"
                        },
                        "large": {
                            "w": 1024,
                            "h": 768,
                            "resize": "fit"
                        },
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "small": {
                            "w": 340,
                            "h": 255,
                            "resize": "fit"
                        }
                    }
                }
                ]
            },
            "extended_entities": {
                "media": [
                {
                    "id": 498791445369585660,
                    "id_str": "498791445369585665",
                    "indices": [
                    94,
                    116
                    ],
                    "media_url": "http://pbs.twimg.com/media/BuwQLUZCAAETYWx.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/BuwQLUZCAAETYWx.jpg",
                    "url": "http://t.co/L9hnaEY5ZA",
                    "display_url": "pic.twitter.com/L9hnaEY5ZA",
                    "expanded_url": "http://twitter.com/ADuero/status/498791517117759488/photo/1",
                    "type": "photo",
                    "sizes": {
                        "medium": {
                            "w": 600,
                            "h": 450,
                            "resize": "fit"
                        },
                        "large": {
                            "w": 1024,
                            "h": 768,
                            "resize": "fit"
                        },
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "small": {
                            "w": 340,
                            "h": 255,
                            "resize": "fit"
                        }
                    }
                }
                ]
            },
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "lang": "es"
        };
        tmCtrl.add(basicTweet);
    }, 2000);

window.setTimeout(function sendRetweet() {
    console.log('sendRetweet');
    if (!tmCtrl) {
        tmCtrl = new timeline.controller();
    }
    var RT = {
        "created_at": "Mon Aug 11 11:43:16 +0000 2014",
        "id": 498796789479522300,
        "id_str": "498796789479522304",
        "text": "RT @Eurotuit: Por qué el momento #eureka puede llegar en vacaciones | http://t.co/sL707Kx04K | @next_ciencia http://t.co/4GZqtJSChY",
        "source": "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
        "truncated": false,
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
            "id": 2327343992,
            "id_str": "2327343992",
            "name": "Next",
            "screen_name": "next_ciencia",
            "location": "aberron@vozpopuli.com",
            "description": "Ciencia y futuro en Vozpópuli. Editado por @aberron",
            "url": "http://t.co/FmmCoYYvOz",
            "entities": {
                "url": {
                    "urls": [
                    {
                        "url": "http://t.co/FmmCoYYvOz",
                        "expanded_url": "http://vozpopuli.com/next",
                        "display_url": "vozpopuli.com/next",
                        "indices": [
                        0,
                        22
                        ]
                    }
                    ]
                },
                "description": {
                    "urls": []
                }
            },
            "protected": false,
            "followers_count": 3429,
            "friends_count": 294,
            "listed_count": 131,
            "created_at": "Tue Feb 04 16:04:08 +0000 2014",
            "favourites_count": 89,
            "utc_offset": 7200,
            "time_zone": "Amsterdam",
            "geo_enabled": false,
            "verified": false,
            "statuses_count": 803,
            "lang": "es",
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "C0DEED",
            "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
            "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
            "profile_background_tile": false,
            "profile_image_url": "http://pbs.twimg.com/profile_images/434671031039447040/A6JE1k1A_normal.png",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/434671031039447040/A6JE1k1A_normal.png",
            "profile_banner_url": "https://pbs.twimg.com/profile_banners/2327343992/1392470514",
            "profile_link_color": "0084B4",
            "profile_sidebar_border_color": "C0DEED",
            "profile_sidebar_fill_color": "DDEEF6",
            "profile_text_color": "333333",
            "profile_use_background_image": true,
            "default_profile": true,
            "default_profile_image": false,
            "following": true,
            "follow_request_sent": false,
            "notifications": true
        },
        "geo": null,
        "coordinates": null,
        "place": null,
        "contributors": null,
        "retweeted_status": {
            "created_at": "Sun Aug 10 10:09:06 +0000 2014",
            "id": 498410704677134340,
            "id_str": "498410704677134336",
            "text": "Por qué el momento #eureka puede llegar en vacaciones | http://t.co/sL707Kx04K | @next_ciencia http://t.co/4GZqtJSChY",
            "source": "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
            "truncated": false,
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "user": {
                "id": 2316012757,
                "id_str": "2316012757",
                "name": "Eurotuit",
                "screen_name": "Eurotuit",
                "location": "",
                "description": "Víctor Hugo: Un día vendrá en el que todas vosotras, naciones del continente, sin perder vuestras cualidades, os fundiréis estrechamente en una unidad superior.",
                "url": null,
                "entities": {
                    "description": {
                        "urls": []
                    }
                },
                "protected": false,
                "followers_count": 736,
                "friends_count": 736,
                "listed_count": 5,
                "created_at": "Tue Jan 28 20:02:00 +0000 2014",
                "favourites_count": 157,
                "utc_offset": 7200,
                "time_zone": "Madrid",
                "geo_enabled": true,
                "verified": false,
                "statuses_count": 6185,
                "lang": "es",
                "contributors_enabled": false,
                "is_translator": false,
                "is_translation_enabled": false,
                "profile_background_color": "FFFFFF",
                "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/450335886207512576/I9zaFRsu.jpeg",
                "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/450335886207512576/I9zaFRsu.jpeg",
                "profile_background_tile": false,
                "profile_image_url": "http://pbs.twimg.com/profile_images/498497200628826112/AYE-5Yi1_normal.jpeg",
                "profile_image_url_https": "https://pbs.twimg.com/profile_images/498497200628826112/AYE-5Yi1_normal.jpeg",
                "profile_banner_url": "https://pbs.twimg.com/profile_banners/2316012757/1407706571",
                "profile_link_color": "D16C1F",
                "profile_sidebar_border_color": "FFFFFF",
                "profile_sidebar_fill_color": "DDEEF6",
                "profile_text_color": "333333",
                "profile_use_background_image": false,
                "default_profile": false,
                "default_profile_image": false,
                "following": false,
                "follow_request_sent": false,
                "notifications": false
            },
            "geo": null,
            "coordinates": null,
            "place": null,
            "contributors": null,
            "retweet_count": 1,
            "favorite_count": 0,
            "entities": {
                "hashtags": [
                {
                    "text": "eureka",
                    "indices": [
                    19,
                    26
                    ]
                }
                ],
                "symbols": [],
                "urls": [
                {
                    "url": "http://t.co/sL707Kx04K",
                    "expanded_url": "http://vozpopuli.com/next/47587-notc",
                    "display_url": "vozpopuli.com/next/47587-notc",
                    "indices": [
                    56,
                    78
                    ]
                }
                ],
                "user_mentions": [
                {
                    "screen_name": "next_ciencia",
                    "name": "Next",
                    "id": 2327343992,
                    "id_str": "2327343992",
                    "indices": [
                    81,
                    94
                    ]
                }
                ],
                "media": [
                {
                    "id": 498410703229702140,
                    "id_str": "498410703229702144",
                    "indices": [
                    95,
                    117
                    ],
                    "media_url": "http://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                    "url": "http://t.co/4GZqtJSChY",
                    "display_url": "pic.twitter.com/4GZqtJSChY",
                    "expanded_url": "http://twitter.com/Eurotuit/status/498410704677134336/photo/1",
                    "type": "photo",
                    "sizes": {
                        "small": {
                            "w": 340,
                            "h": 176,
                            "resize": "fit"
                        },
                        "large": {
                            "w": 879,
                            "h": 454,
                            "resize": "fit"
                        },
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "medium": {
                            "w": 600,
                            "h": 310,
                            "resize": "fit"
                        }
                    }
                }
                ]
            },
            "extended_entities": {
                "media": [
                {
                    "id": 498410703229702140,
                    "id_str": "498410703229702144",
                    "indices": [
                    95,
                    117
                    ],
                    "media_url": "http://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                    "url": "http://t.co/4GZqtJSChY",
                    "display_url": "pic.twitter.com/4GZqtJSChY",
                    "expanded_url": "http://twitter.com/Eurotuit/status/498410704677134336/photo/1",
                    "type": "photo",
                    "sizes": {
                        "small": {
                            "w": 340,
                            "h": 176,
                            "resize": "fit"
                        },
                        "large": {
                            "w": 879,
                            "h": 454,
                            "resize": "fit"
                        },
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "medium": {
                            "w": 600,
                            "h": 310,
                            "resize": "fit"
                        }
                    }
                }
                ]
            },
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "lang": "es"
        },
        "retweet_count": 1,
        "favorite_count": 0,
        "entities": {
            "hashtags": [
            {
                "text": "eureka",
                "indices": [
                33,
                40
                ]
            }
            ],
            "symbols": [],
            "urls": [
            {
                "url": "http://t.co/sL707Kx04K",
                "expanded_url": "http://vozpopuli.com/next/47587-notc",
                "display_url": "vozpopuli.com/next/47587-notc",
                "indices": [
                70,
                92
                ]
            }
            ],
            "user_mentions": [
            {
                "screen_name": "Eurotuit",
                "name": "Eurotuit",
                "id": 2316012757,
                "id_str": "2316012757",
                "indices": [
                3,
                12
                ]
            },
            {
                "screen_name": "next_ciencia",
                "name": "Next",
                "id": 2327343992,
                "id_str": "2327343992",
                "indices": [
                95,
                108
                ]
            }
            ],
            "media": [
            {
                "id": 498410703229702140,
                "id_str": "498410703229702144",
                "indices": [
                109,
                131
                ],
                "media_url": "http://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                "media_url_https": "https://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                "url": "http://t.co/4GZqtJSChY",
                "display_url": "pic.twitter.com/4GZqtJSChY",
                "expanded_url": "http://twitter.com/Eurotuit/status/498410704677134336/photo/1",
                "type": "photo",
                "sizes": {
                    "small": {
                        "w": 340,
                        "h": 176,
                        "resize": "fit"
                    },
                    "large": {
                        "w": 879,
                        "h": 454,
                        "resize": "fit"
                    },
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "medium": {
                        "w": 600,
                        "h": 310,
                        "resize": "fit"
                    }
                },
                "source_status_id": 498410704677134340,
                "source_status_id_str": "498410704677134336"
            }
            ]
        },
        "extended_entities": {
            "media": [
            {
                "id": 498410703229702140,
                "id_str": "498410703229702144",
                "indices": [
                109,
                131
                ],
                "media_url": "http://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                "media_url_https": "https://pbs.twimg.com/media/Buq15NZCUAAqNGf.jpg",
                "url": "http://t.co/4GZqtJSChY",
                "display_url": "pic.twitter.com/4GZqtJSChY",
                "expanded_url": "http://twitter.com/Eurotuit/status/498410704677134336/photo/1",
                "type": "photo",
                "sizes": {
                    "small": {
                        "w": 340,
                        "h": 176,
                        "resize": "fit"
                    },
                    "large": {
                        "w": 879,
                        "h": 454,
                        "resize": "fit"
                    },
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "medium": {
                        "w": 600,
                        "h": 310,
                        "resize": "fit"
                    }
                },
                "source_status_id": 498410704677134340,
                "source_status_id_str": "498410704677134336"
            }
            ]
        },
        "favorited": false,
        "retweeted": false,
        "possibly_sensitive": false,
        "lang": "es"
    };
    tmCtrl.add(RT);
}, 5000);

window.setTimeout(function sendRetweet() {
    console.log('sendRetweet');
    if (!tmCtrl) {
        tmCtrl = new timeline.controller();
    }
    var RT_with_pic = {
        "created_at": "Mon Aug 11 13:56:59 +0000 2014",
        "id": 498830440032399360,
        "id_str": "498830440032399361",
        "text": "RT @HombreGancho: Allá vamos @sonoramaribera , el VIERNES a las 20:20 h., empezamos nueva etapa #incontrolable #vuelvehombregancho http://t…",
        "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
        "truncated": false,
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
            "id": 234112072,
            "id_str": "234112072",
            "name": "Sonorama Ribera",
            "screen_name": "sonoramaribera",
            "location": "Aranda de Duero",
            "description": "Festival Sonorama Ribera (Premio UFI Mejor festival del año 2012) ¡Ya a la venta las entradas para #SonoramaRibera2014 en nuestra web oficial!",
            "url": "http://t.co/YsFBzxbtjl",
            "entities": {
                "url": {
                    "urls": [
                    {
                        "url": "http://t.co/YsFBzxbtjl",
                        "expanded_url": "http://www.sonorama-aranda.com",
                        "display_url": "sonorama-aranda.com",
                        "indices": [
                        0,
                        22
                        ]
                    }
                    ]
                },
                "description": {
                    "urls": []
                }
            },
            "protected": false,
            "followers_count": 16959,
            "friends_count": 744,
            "listed_count": 389,
            "created_at": "Tue Jan 04 21:46:54 +0000 2011",
            "favourites_count": 946,
            "utc_offset": 10800,
            "time_zone": "Athens",
            "geo_enabled": true,
            "verified": false,
            "statuses_count": 3515,
            "lang": "es",
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "ED7715",
            "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/378800000132934244/dUfo7RKF.jpeg",
            "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/378800000132934244/dUfo7RKF.jpeg",
            "profile_background_tile": false,
            "profile_image_url": "http://pbs.twimg.com/profile_images/378800000819191443/385679f9244b9fbf3400f9a3b8574050_normal.jpeg",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/378800000819191443/385679f9244b9fbf3400f9a3b8574050_normal.jpeg",
            "profile_banner_url": "https://pbs.twimg.com/profile_banners/234112072/1385967126",
            "profile_link_color": "0084B4",
            "profile_sidebar_border_color": "FFFFFF",
            "profile_sidebar_fill_color": "F6F6F6",
            "profile_text_color": "333333",
            "profile_use_background_image": true,
            "default_profile": false,
            "default_profile_image": false,
            "following": true,
            "follow_request_sent": false,
            "notifications": false
        },
        "geo": null,
        "coordinates": null,
        "place": null,
        "contributors": null,
        "retweeted_status": {
            "created_at": "Mon Aug 11 11:54:37 +0000 2014",
            "id": 498799645859278850,
            "id_str": "498799645859278848",
            "text": "Allá vamos @sonoramaribera , el VIERNES a las 20:20 h., empezamos nueva etapa #incontrolable #vuelvehombregancho http://t.co/Bbquib5mHr",
            "source": "<a href=\"http://www.apple.com\" rel=\"nofollow\">iOS</a>",
            "truncated": false,
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "user": {
                "id": 2604116479,
                "id_str": "2604116479",
                "name": "el hombre gancho",
                "screen_name": "HombreGancho",
                "location": "",
                "description": "",
                "url": null,
                "entities": {
                    "description": {
                        "urls": []
                    }
                },
                "protected": false,
                "followers_count": 209,
                "friends_count": 134,
                "listed_count": 3,
                "created_at": "Fri Jul 04 20:50:04 +0000 2014",
                "favourites_count": 52,
                "utc_offset": null,
                "time_zone": null,
                "geo_enabled": false,
                "verified": false,
                "statuses_count": 33,
                "lang": "es",
                "contributors_enabled": false,
                "is_translator": false,
                "is_translation_enabled": false,
                "profile_background_color": "131516",
                "profile_background_image_url": "http://abs.twimg.com/images/themes/theme14/bg.gif",
                "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme14/bg.gif",
                "profile_background_tile": true,
                "profile_image_url": "http://pbs.twimg.com/profile_images/485165996391399424/VkCwLIDw_normal.jpeg",
                "profile_image_url_https": "https://pbs.twimg.com/profile_images/485165996391399424/VkCwLIDw_normal.jpeg",
                "profile_banner_url": "https://pbs.twimg.com/profile_banners/2604116479/1404508425",
                "profile_link_color": "009999",
                "profile_sidebar_border_color": "EEEEEE",
                "profile_sidebar_fill_color": "EFEFEF",
                "profile_text_color": "333333",
                "profile_use_background_image": true,
                "default_profile": false,
                "default_profile_image": false,
                "following": false,
                "follow_request_sent": false,
                "notifications": false
            },
            "geo": null,
            "coordinates": null,
            "place": null,
            "contributors": null,
            "retweet_count": 14,
            "favorite_count": 9,
            "entities": {
                "hashtags": [
                {
                    "text": "incontrolable",
                    "indices": [
                    78,
                    92
                    ]
                },
                {
                    "text": "vuelvehombregancho",
                    "indices": [
                    93,
                    112
                    ]
                }
                ],
                "symbols": [],
                "urls": [],
                "user_mentions": [
                {
                    "screen_name": "sonoramaribera",
                    "name": "Sonorama Ribera",
                    "id": 234112072,
                    "id_str": "234112072",
                    "indices": [
                    11,
                    26
                    ]
                }
                ],
                "media": [
                {
                    "id": 498799645716664300,
                    "id_str": "498799645716664320",
                    "indices": [
                    113,
                    135
                    ],
                    "media_url": "http://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                    "url": "http://t.co/Bbquib5mHr",
                    "display_url": "pic.twitter.com/Bbquib5mHr",
                    "expanded_url": "http://twitter.com/HombreGancho/status/498799645859278848/photo/1",
                    "type": "photo",
                    "sizes": {
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "medium": {
                            "w": 451,
                            "h": 800,
                            "resize": "fit"
                        },
                        "small": {
                            "w": 340,
                            "h": 603,
                            "resize": "fit"
                        },
                        "large": {
                            "w": 451,
                            "h": 800,
                            "resize": "fit"
                        }
                    }
                }
                ]
            },
            "extended_entities": {
                "media": [
                {
                    "id": 498799645716664300,
                    "id_str": "498799645716664320",
                    "indices": [
                    113,
                    135
                    ],
                    "media_url": "http://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                    "media_url_https": "https://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                    "url": "http://t.co/Bbquib5mHr",
                    "display_url": "pic.twitter.com/Bbquib5mHr",
                    "expanded_url": "http://twitter.com/HombreGancho/status/498799645859278848/photo/1",
                    "type": "photo",
                    "sizes": {
                        "thumb": {
                            "w": 150,
                            "h": 150,
                            "resize": "crop"
                        },
                        "medium": {
                            "w": 451,
                            "h": 800,
                            "resize": "fit"
                        },
                        "small": {
                            "w": 340,
                            "h": 603,
                            "resize": "fit"
                        },
                        "large": {
                            "w": 451,
                            "h": 800,
                            "resize": "fit"
                        }
                    }
                }
                ]
            },
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "lang": "es"
        },
        "retweet_count": 14,
        "favorite_count": 0,
        "entities": {
            "hashtags": [
            {
                "text": "incontrolable",
                "indices": [
                96,
                110
                ]
            },
            {
                "text": "vuelvehombregancho",
                "indices": [
                111,
                130
                ]
            }
            ],
            "symbols": [],
            "urls": [],
            "user_mentions": [
            {
                "screen_name": "HombreGancho",
                "name": "el hombre gancho",
                "id": 2604116479,
                "id_str": "2604116479",
                "indices": [
                3,
                16
                ]
            },
            {
                "screen_name": "sonoramaribera",
                "name": "Sonorama Ribera",
                "id": 234112072,
                "id_str": "234112072",
                "indices": [
                29,
                44
                ]
            }
            ],
            "media": [
            {
                "id": 498799645716664300,
                "id_str": "498799645716664320",
                "indices": [
                139,
                140
                ],
                "media_url": "http://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                "media_url_https": "https://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                "url": "http://t.co/Bbquib5mHr",
                "display_url": "pic.twitter.com/Bbquib5mHr",
                "expanded_url": "http://twitter.com/HombreGancho/status/498799645859278848/photo/1",
                "type": "photo",
                "sizes": {
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "medium": {
                        "w": 451,
                        "h": 800,
                        "resize": "fit"
                    },
                    "small": {
                        "w": 340,
                        "h": 603,
                        "resize": "fit"
                    },
                    "large": {
                        "w": 451,
                        "h": 800,
                        "resize": "fit"
                    }
                },
                "source_status_id": 498799645859278850,
                "source_status_id_str": "498799645859278848"
            }
            ]
        },
        "extended_entities": {
            "media": [
            {
                "id": 498799645716664300,
                "id_str": "498799645716664320",
                "indices": [
                139,
                140
                ],
                "media_url": "http://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                "media_url_https": "https://pbs.twimg.com/media/BuwXopEIUAAekkj.jpg",
                "url": "http://t.co/Bbquib5mHr",
                "display_url": "pic.twitter.com/Bbquib5mHr",
                "expanded_url": "http://twitter.com/HombreGancho/status/498799645859278848/photo/1",
                "type": "photo",
                "sizes": {
                    "thumb": {
                        "w": 150,
                        "h": 150,
                        "resize": "crop"
                    },
                    "medium": {
                        "w": 451,
                        "h": 800,
                        "resize": "fit"
                    },
                    "small": {
                        "w": 340,
                        "h": 603,
                        "resize": "fit"
                    },
                    "large": {
                        "w": 451,
                        "h": 800,
                        "resize": "fit"
                    }
                },
                "source_status_id": 498799645859278850,
                "source_status_id_str": "498799645859278848"
            }
            ]
        },
        "favorited": false,
        "retweeted": false,
        "possibly_sensitive": false,
        "lang": "es"
    };
    tmCtrl.add(RT_with_pic);
}, 5000);
})(window);