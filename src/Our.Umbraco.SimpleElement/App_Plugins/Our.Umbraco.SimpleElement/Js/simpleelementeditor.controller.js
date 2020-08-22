(function () {
    "use strict";
    function SimpleElementEditorController($scope, $http, editorState, simpleElementServices) {

        var doctype = $scope.model.config.doctype;
        var vm = this;

        vm.loading = true;
        vm.edit = false;

        vm.tabs = [];


        vm.changeTab = function(selectedTab) {
            vm.tabs.forEach(function (tab) {
                tab.active = false;
            });

            selectedTab.active = true;

            vm.tab = selectedTab;
        };

        function init() {
            vm.loading = true;

            simpleElementServices.scaffold(doctype, $scope.model.data).then(function (result) {

                vm.edit = true;

                vm.tabs = result.scaffold.variants[0].tabs;
                vm.data = result.menuNode;

                
                vm.tab = vm.tabs[0];

                vm.loading = false;

            }, function (error) {
                notificationsService.error("Error loading document type: \"" + $scope.model.selectedDoctype + "\"", error.errorMsg);
            });
        }

        init();
    }

    angular.module("umbraco").controller("SimpleElement.EditorController", SimpleElementEditorController);
})();