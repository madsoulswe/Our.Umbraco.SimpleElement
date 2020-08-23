(function () {
    "use strict";
    function SimpleElementEditorController($scope, $http, editorState, simpleElementServices) {

        
        var vm = this;



        vm.doctype = $scope.model.config.doctype;
        vm.alignLeft = $scope.model.config.alignLeft == "1";

        vm.loading = true;
        vm.edit = false;

        console.log($scope);

        $scope.model.hideLabel = $scope.model.config.hideLabel == "1";

        vm.data = $scope.model.value || {};

        console.log("LOAD");
        console.log($scope.model.value);

        vm.changeTab = function (selectedTab) {

            vm.node.variants[0].tabs.forEach(function (tab) {
                tab.active = false;
            });

            selectedTab.active = true;

            vm.tab = selectedTab;
        };

        $scope.$on("formSubmitting", function (ev, args) {

            var flattNode = simpleElementServices.flatten(vm.node);

            var clone = $.extend(true, {
                key: vm.data.key,
                elementType: vm.data.elementType
            }, flattNode);

            console.log("SAVE");
            console.log(clone);

            $scope.model.value = clone;

        });

        function init() {
            if (!vm.data.key)
                vm.data.key = String.CreateGuid();

            if(!vm.data.elementType)
                vm.data.elementType = vm.doctype;

            vm.loading = true;

            simpleElementServices.scaffold(vm.doctype, vm.data).then(function (result) {

                vm.edit = true;

                vm.node = result.scaffold;
                vm.data = result.data;

                vm.tab = vm.node.variants[0].tabs[0];

                vm.loading = false;

            }, function (error) {
                    notificationsService.error("Error loading document type: \"" + vm.doctype + "\"", error.errorMsg);
            });
        }

        init();
    }

    angular.module("umbraco").controller("SimpleElement.EditorController", SimpleElementEditorController);
})();