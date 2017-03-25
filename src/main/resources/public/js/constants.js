angular.module('son')
    .constant('APP_REQUIRES', {
        scripts: {
            'jquery': ['vendor/jquery/jquery.min.js'],
            'icons': ['vendor/fontawesome/css/font-awesome.min.css', 'vendor/simplelineicons/simple-line-icons.css'],
            'modernizr': ['vendor/modernizr/modernizr.js'],
            'fastclick': ['vendor/fastclick/fastclick.js'],
            'filestyle': ['vendor/filestyle/bootstrap-filestyle.min.js'],
            'csspiner': ['vendor/csspinner/csspinner.min.css'],
            'animo': ['vendor/animo/animo.min.js'],
            'sparklines': ['vendor/sparklines/jquery.sparkline.min.js'],
            'slimscroll': ['vendor/slimscroll/jquery.slimscroll.min.js'],
            'screenfull': ['vendor/screenfull/screenfull.min.js'],
            'classyloader': ['vendor/classyloader/js/jquery.classyloader.min.js'],
            'vector-map': ['vendor/jvectormap/jquery-jvectormap-1.2.2.min.js', 'vendor/jvectormap/maps/jquery-jvectormap-world-mill-en.js', 'vendor/jvectormap/jquery-jvectormap-1.2.2.css'],
            'loadGoogleMapsJS': ['vendor/gmap/load-google-maps.js'],
            'google-map': ['vendor/gmap/jquery.gmap.min.js'],
            'flot-chart': ['vendor/flot/jquery.flot.min.js'],
            'flot-chart-plugins': ['vendor/flot/jquery.flot.tooltip.min.js', 'vendor/flot/jquery.flot.resize.min.js', 'vendor/flot/jquery.flot.pie.min.js', 'vendor/flot/jquery.flot.time.min.js', 'vendor/flot/jquery.flot.categories.min.js', 'vendor/flot/jquery.flot.spline.min.js'],
            'jquery-ui': ['vendor/jqueryui/js/jquery-ui-1.10.4.custom.min.js', 'vendor/touch-punch/jquery.ui.touch-punch.min.js'],
            'chosen': ['vendor/chosen/chosen.jquery.min.js', 'vendor/chosen/chosen.min.css'],
            'slider': ['vendor/slider/js/bootstrap-slider.js', 'vendor/slider/css/slider.css'],
            'moment': ['vendor/moment/min/moment-with-langs.min.js'],
            'fullcalendar': ['vendor/fullcalendar/fullcalendar.min.js', 'vendor/fullcalendar/fullcalendar.css'],
            'codemirror': ['vendor/codemirror/lib/codemirror.js', 'vendor/codemirror/lib/codemirror.css'],
            'codemirror-plugins': ['vendor/codemirror/addon/mode/overlay.js', 'vendor/codemirror/mode/markdown/markdown.js', 'vendor/codemirror/mode/xml/xml.js', 'vendor/codemirror/mode/gfm/gfm.js', 'vendor/marked/marked.js'],
            'datetimepicker': ['vendor/datetimepicker/js/bootstrap-datetimepicker.min.js', 'vendor/datetimepicker/css/bootstrap-datetimepicker.min.css'],
            'taginput': ['vendor/tagsinput/bootstrap-tagsinput.min.js', 'vendor/tagsinput/bootstrap-tagsinput.css'],
            'inputmask': ['vendor/inputmask/jquery.inputmask.bundle.js'],
            'bwizard': ['vendor/wizard/js/bwizard.min.js'],
            'parsley': ['vendor/parsley/parsley.min.js'],
            'datatables': ['vendor/datatable/media/js/jquery.dataTables.min.js', 'vendor/datatable/extensions/datatable-bootstrap/css/dataTables.bootstrap.css'],
            'datatables-pugins': ['vendor/datatable/extensions/datatable-bootstrap/js/dataTables.bootstrap.js', 'vendor/datatable/extensions/datatable-bootstrap/js/dataTables.bootstrapPagination.js', 'vendor/datatable/extensions/ColVis/js/dataTables.colVis.min.js', 'vendor/datatable/extensions/ColVis/css/dataTables.colVis.css'],
            'flatdoc': ['vendor/flatdoc/flatdoc.js']
        },
        modules: [
            {name: 'toaster', files: ['vendor/toaster/toaster.js', 'vendor/toaster/toaster.css']}
        ]

    })
    .constant('APP_END_POINT', '')
    .constant('APP_CEP_END_POINT', 'https://viacep.com.br/ws/')
    .constant('APP_COLORS', {
        'primary': '#5d9cec',
        'success': '#27c24c',
        'info': '#23b7e5',
        'warning': '#ff902b',
        'danger': '#f05050',
        'inverse': '#131e26',
        'green': '#37bc9b',
        'pink': '#f532e5',
        'purple': '#7266ba',
        'dark': '#3a3f51',
        'yellow': '#fad732',
        'gray-darker': '#232735',
        'gray-dark': '#3a3f51',
        'gray': '#dde6e9',
        'gray-light': '#e4eaec',
        'gray-lighter': '#edf1f2'
    })
    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    })
    .constant('APP_MENUS', [
        {
            "_id": 6,
            "text": "Dashboards",
            "sref": "#",
            "icon": "icon-speedometer",
            "menu": true,
            "heading": false,
            "submenu": []
        },
        {
            "_id": 1,
            "text": "Acessos",
            "sref": "#",
            "icon": "icon-lock",
            "menu": true,
            "heading": false,
            "submenu": [
                {
                    "_id": 11,
                    "text": "Criar Usuario",
                    "sref": "app.createuser"
                },
                {
                    "_id": 12,
                    "text": "Alterar Usuario",
                    "sref": "app.alteruser"
                },
                {
                    "_id": 13,
                    "text": "Criar Perfil",
                    "sref": "app.criarperfil"
                },
                {
                    "_id": 14,
                    "text": "Alterar Perfil",
                    "sref": "app.alterperfil"
                }
            ]
        },
        {
            "_id": 2,
            "text": "Pessoa",
            "sref": "#",
            "icon": "icon-users",
            "menu": true,
            "heading": false,
            "submenu": [
                {
                    "_id": 21,
                    "text": "Criar Pessoa",
                    "sref": "app.createpessoa"
                },
                {
                    "_id": 22,
                    "text": "Buscar Pessoa",
                    "sref": "app.buscarpessoa"
                }
            ]
        },
        {
            "_id": 100,
            "text": "Pessoa",
            "sref": "app.wellcome",
            "menu": false
        },
        {
            "_id": 101,
            "text": "Pessoa",
            "sref": "app.nroute",
            "menu": false
        },
        {
            "_id": 3,
            "text": "Itens",
            "sref": "#",
            "icon": "icon-paper-clip",
            "menu": true,
            "heading": false,
            "submenu": [
                {
                    "_id": 31,
                    "text": "Unidade",
                    "sref": "app.unidade"
                },
                {
                    "_id": 32,
                    "text": "Item",
                    "sref": "app.createitem"
                }
            ]
        },
        {
            "_id": 4,
            "text": "Auxiliares",
            "sref": "#",
            "icon": "icon-folder-alt",
            "menu": true,
            "heading": false,
            "submenu": [
                {
                    "_id": 41,
                    "text": "Veiculos",
                    "sref": "app.veiculos"
                },
                {
                    "_id": 42,
                    "text": "Motoristas",
                    "sref": "app.motoristas"
                },
                {
                    "_id": 43,
                    "text": "Ruas",
                    "sref": "app.ruas"
                },
                {
                    "_id": 44,
                    "text": "Vasilhames",
                    "sref": "app.vasilhames"
                }
            ]
        },
        {
            "_id": 5,
            "text": "Movimentações",
            "sref": "#",
            "icon": "icon-directions",
            "menu": true,
            "heading": false,
            "submenu": [
                {
                    "_id": 51,
                    "text": "Movimentação",
                    "sref": "app.movimentacao"
                },
                {
                    "_id": 52,
                    "text": "Listar Movimentações",
                    "sref": "app.listamovimentacoes"
                },
                {
                    "_id": 53,
                    "text": "Conferência",
                    "sref": "app.conferencia"
                },
                {
                    "_id": 54,
                    "text": "Listar Conferência",
                    "sref": "app.listaconferencia"
                }
            ]
        },
        {
            "_id": 80,
            "text": "Vendas",
            "sref": "#",
            "icon": "icon-basket-loaded",
            "menu": true,
            "heading": false,
            "submenu": []
        },
        {
            "_id": 90,
            "text": "Relatorios",
            "sref": "#",
            "icon": "icon-doc",
            "menu": true,
            "heading": false,
            "submenu": [
                {
                    "_id": 91,
                    "text": "Posição Item",
                    "sref": "app.posicaoitem"
                },
                {
                    "_id": 93,
                    "text": "Posição Vasilhame",
                    "sref": "app.posicaovasilhame"
                },
                {
                    "_id": 92,
                    "text": "Auditoria Item",
                    "sref": "app.auditoriaitem"
                },
                {
                    "_id": 94,
                    "text": "Inventário",
                    "sref": "app.inventario"
                }
            ]
        }
    ])
;

