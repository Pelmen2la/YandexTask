angular.module('yandexMMTaskApp.controllers', ['ngCookies', 'yandexMMTaskApp.services']);

angular.module('yandexMMTaskApp.controllers')
    .controller('MainController', ['$scope', '$cookies', 'Utils', 'CssClasses', function($scope, $cookies, Utils, CssClasses) {
        $scope.tabs = ['Список иконок', 'Текст', 'Контрол рейтинга'];
        $scope.tabChangeTime = Utils.now();
        $scope.tabsActiveTime = {};
        $scope.selectedTabIndex = $cookies.get('activeTabIndex') || 0;
        $scope.logEntries = [];
        $scope.showLog = true;

        $scope.tabs.forEach(function(tab) {
            $scope.tabsActiveTime[tab] = 0;
        });
        window.setInterval(function() { $scope.tabsActiveTime[$scope.tabs[$scope.selectedTabIndex]] += 0.1 }, 100);

        $scope.isTabActive = function(index) {
            return $scope.selectedTabIndex == index;
        };
        $scope.isTabIndexValid = function(index) {
            return index >= 0 && index < $scope.tabs.length;
        };
        $scope.selectTab = function(index, addMessageToLog) {
            if(!$scope.isTabIndexValid(index)) {
                $scope.addMessageToLog(Utils.getSelectTabErrorMessage(index, $scope.tabs.length - 1), CssClasses.WITH_LINE_SEPARATOR);
                return;
            }
            $cookies.put('activeTabIndex', index);
            $scope.selectedTabIndex = index;
            if(addMessageToLog) {
                $scope.addMessageToLog(Utils.getSelectTabSuccessMessage(index, $scope.tabs[index]), CssClasses.WITH_LINE_SEPARATOR);
            }
        };
        $scope.swapTabs = function(firstIndex, secondIndex) {
            if(!$scope.isTabIndexValid(firstIndex) || !$scope.isTabIndexValid(secondIndex)) {
                var errorMessage = Utils.getSwapTabsErrorMessage(firstIndex, secondIndex, $scope.tabs.length - 1);
                $scope.addMessageToLog(errorMessage, CssClasses.WITH_LINE_SEPARATOR);
                return;
            }
            var tabBuf = $scope.tabs[firstIndex],
                message = Utils.getSwapTabsSuccessMessage(firstIndex, $scope.tabs[firstIndex], secondIndex, $scope.tabs[secondIndex]);
            $scope.tabs[firstIndex] = $scope.tabs[secondIndex];
            $scope.tabs[secondIndex] = tabBuf;
            $scope.addMessageToLog(message, CssClasses.WITH_LINE_SEPARATOR);
        };
        $scope.showStat = function (consoleActiveTime) {
            $scope.addMessageToLog(Utils.getWorkTimeMessage(consoleActiveTime));
            $scope.addMessageToLog(Utils.getTabsStatHeaderText());
            for (var i = 0; i < $scope.tabs.length; i++) {
                var tabName = $scope.tabs[i],
                    cssClass = i === $scope.tabs.length - 1 ?
                        Utils.formatString('{0} {1}', [CssClasses.TAB_INFO, CssClasses.WITH_LINE_SEPARATOR]) : CssClasses.TAB_INFO;
                $scope.addMessageToLog(Utils.getTabStatText(i, tabName, $scope.tabsActiveTime[tabName]), cssClass);
            }
        };
        $scope.addCommandToLog = function(command) {
            $scope.addMessageToLog(Utils.getCommandLogText(command));
        };
        $scope.processWrongCommand = function(command) {
            var errorCssClass = Utils.formatString('{0} {1}', [CssClasses.ERROR, CssClasses.WITH_LINE_SEPARATOR]);
            $scope.addMessageToLog(Utils.getWrongCommandMessage(command), errorCssClass);
        };
        $scope.addMessageToLog = function(text, cssClass) {
            $scope.logEntries.push({ text: text, class: cssClass || ''});
        };
    }])
    .controller('ConsoleController', ['$scope', 'Utils', function($scope, Utils) {
        $scope.maxCommandsCacheCount = 10;
        $scope.consoleText = '';
        $scope.commandsCache = [];
        $scope.commandIndex = null;
        $scope.consoleActiveTime = 0;

        $scope.onConsoleKeyDown = function(event) {
            switch(event.keyCode) {
                case 13:
                    $scope.processConsoleCommand(event.target.value);
                    break;
                case 38:
                    $scope.restoreConsoleCommand(true);
                    break;
                case 40:
                    $scope.restoreConsoleCommand(false);
                    break;
            }
        };
        $scope.onConsoleButtonClick = function() {
            $scope.processConsoleCommand($('#console').val());
        };
        $scope.onConsoleFocus = function() {
            $scope.consoleUsingInterval = window.setInterval(function() { $scope.consoleActiveTime += 0.1}, 100);
        };
        $scope.onConsoleBlur = function() {
            window.clearInterval($scope.consoleUsingInterval);
        };
        $scope.processConsoleCommand = function(command) {
            if(command === '') {
                return;
            }
            $scope.addCommandToLog(command);
            if(/^selectTab\(-*[0-9]+\)$/.test(command)) {
                $scope.selectTab(command.match(/-*[0-9]+/)[0], true);
            } else if(/^swapTabs\(-*[0-9]+,\s*-*[0-9]+\)$/.test(command)) {
                var tabsIndices = command.match(/-*[0-9]+/g);
                $scope.swapTabs(tabsIndices[0], tabsIndices[1]);
            } else if(command === 'showStat()') {
                $scope.showStat($scope.consoleActiveTime);
            } else {
                $scope.processWrongCommand(command);
            }
            $scope.commandsCache.length === $scope.maxCommandsCacheCount && $scope.commandsCache.pop();
            $scope.commandsCache.unshift(command);
            window.setTimeout(function() {
                $('#log').scrollTop($('#log')[0].scrollHeight);
            }, 0);
            $scope.consoleText = '';
            $scope.commandIndex = null;
        };
        $scope.restoreConsoleCommand = function(isUp) {
            if(!$scope.commandsCache.length) {
                return;
            }
            if(isUp) {
                $scope.commandIndex = $scope.commandIndex === null ? 0 : $scope.commandIndex + 1;
                if($scope.commandIndex > $scope.commandsCache.length - 1) {
                    $scope.commandIndex = null;
                }
            } else {
                $scope.commandIndex = $scope.commandIndex === null ? $scope.commandsCache.length - 1 : $scope.commandIndex - 1;
                if($scope.commandIndex < 0) {
                    $scope.commandIndex = null;
                }
            }
            $scope.consoleText = $scope.commandIndex !== null ? $scope.commandsCache[$scope.commandIndex] : '';
        };
    }]);