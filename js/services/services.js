angular.module('yandexMMTaskApp.services', []);

angular.module('yandexMMTaskApp.services')
    .constant('StringResources', {
        SECOND_TEXT: 'секунд',
        MINUTE_TEXT: 'минут',
        WORK_TIME_MSG_TPL: 'Общее время работы со страницей: {0}',
        TABS_STAT_HEADER_TEXT: 'Детализация времени просмотра табов:',
        SELECT_TAB_SUCCESS_MSG_TPL: 'Выбран таб №{0} "{1}"',
        SELECT_TAB_ERROR_MSG_TPL: 'Не удалось выбрать таб №{0}. Доступны табы с 0 по {1}.',
        SWAP_TABS_SUCCESS_MSG_TPL: 'Поменяли табы №{0} "{1}" и №{2} "{3}" местами.',
        SWAP_TABS_ERROR_MSG_TPL: 'Не удалось поменять местами табы №{0} и №{1}. Доступны табы с 0 по {2}.',
        COMMAND_LOG_TEXT_TPL: '/> {0}',
        WRONG_COMMAND_MSG_TPL: 'Недопустимая команда: {0}.'
    })
    .constant('CssClasses', {
        WITH_LINE_SEPARATOR: 'with-line-separator',
        TAB_INFO: 'tabInfo',
        ERROR: 'error'
    })

    .service('Utils', ['StringResources', function(StringResources) {
        this.now = function() {
            return (new Date()).getTime();
        };
        this.formatString = function(string, params) {
            for(var i = 0; i <= params.length; i++) {
                string = string.replace('{' + i + '}', params[i]);
            }
            return string;
        };
        this.formatTime = function(seconds) {
            var seconds = parseInt(seconds),
                minutes = parseInt(seconds / 60),
                result = '';
            seconds = seconds - minutes * 60;
            result = seconds + ' ' + this.getTimeText(seconds, StringResources.SECOND_TEXT);
            if(minutes) {
                result = minutes + ' ' + this.getTimeText(minutes, StringResources.MINUTE_TEXT) + ' ' + result;
            }
            return result;
        };
        this.getTimeText = function(count, unitsName) {
            var countText = count.toString(),
                lastCountNum = parseInt((countText[countText.length - 1])),
                lastTwoCountNums = countText.length > 1 ? countText[countText.length - 2] * 10 + lastCountNum : null,
                textEnding = '';
            if(lastCountNum === 1 && (!lastTwoCountNums || lastTwoCountNums != 11)) {
                textEnding = 'а';
            } else if([2, 3, 4].indexOf(lastCountNum) > -1 && (!lastTwoCountNums || [12, 13, 14].indexOf(lastCountNum) === -1)) {
                textEnding = 'ы';
            }
            return unitsName + textEnding;
        };
        this.getWorkTimeMessage = function(time) {
            return this.formatString(StringResources.WORK_TIME_MSG_TPL, [this.formatTime(time)]);
        };
        this.getTabsStatHeaderText = function(time) {
            return StringResources.TABS_STAT_HEADER_TEXT;
        };
        this.getTabStatText = function(index, name, time) {
            return this.formatString('{0} "{1}": {2}', [index, name, this.formatTime(time)]);
        };
        this.getSelectTabSuccessMessage = function(tabIndex, tabName) {
            return this.formatString(StringResources.SELECT_TAB_SUCCESS_MSG_TPL, arguments);
        };
        this.getSelectTabErrorMessage = function(tabIndex, lastTabIndex) {
            return this.formatString(StringResources.SELECT_TAB_ERROR_MSG_TPL, arguments);
        };
        this.getSwapTabsSuccessMessage = function(firstTabIndex, firstTabName, secondTabIndex, secondTabName) {
            return this.formatString(StringResources.SWAP_TABS_SUCCESS_MSG_TPL, arguments);
        };
        this.getSwapTabsErrorMessage = function(firstTabIndex, secondTabIndex, lastTabIndex) {
            return this.formatString(StringResources.SWAP_TABS_ERROR_MSG_TPL, arguments);
        };
        this.getCommandLogText = function(command) {
            return this.formatString(StringResources.COMMAND_LOG_TEXT_TPL, arguments);
        };
        this.getWrongCommandMessage = function(command) {
            return this.formatString(StringResources.WRONG_COMMAND_MSG_TPL, arguments);
        };
    }]);