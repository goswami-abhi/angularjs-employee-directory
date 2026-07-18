var app = angular.module("employeeApp", []);

app.controller("EmployeeController", function ($scope) {

    // Departments
    $scope.departments = [
        "IT",
        "HR",
        "Finance",
        "Marketing",
        "Sales",
        "Operations"
    ];

    // Employee Form Model
    $scope.employee = {};

    // Edit Mode
    $scope.editIndex = -1;

    // Search / Sort
    $scope.searchText = "";
    $scope.selectedDepartment = "";
    $scope.sortBy = "name";

    // Dummy Employee Data
    $scope.employees = [
        {
            name: "John Smith",
            email: "john.smith@gmail.com",
            department: "IT",
            designation: "Frontend Developer",
            salary: 65000,
            joinDate: new Date("2023-01-15")
        },
        {
            name: "Emily Johnson",
            email: "emily.johnson@gmail.com",
            department: "HR",
            designation: "HR Manager",
            salary: 55000,
            joinDate: new Date("2022-08-11")
        },
        {
            name: "Michael Brown",
            email: "michael.brown@gmail.com",
            department: "Finance",
            designation: "Accountant",
            salary: 72000,
            joinDate: new Date("2021-11-01")
        },
        {
            name: "Sophia Davis",
            email: "sophia.davis@gmail.com",
            department: "Marketing",
            designation: "Marketing Executive",
            salary: 50000,
            joinDate: new Date("2024-02-18")
        },
        {
            name: "David Wilson",
            email: "david.wilson@gmail.com",
            department: "Sales",
            designation: "Sales Manager",
            salary: 68000,
            joinDate: new Date("2020-06-12")
        }
    ];

    // Add / Update Employee
    $scope.saveEmployee = function () {

        if ($scope.editIndex === -1) {

            $scope.employees.push({
                name: $scope.employee.name,
                email: $scope.employee.email,
                department: $scope.employee.department,
                designation: $scope.employee.designation,
                salary: $scope.employee.salary,
                joinDate: $scope.employee.joinDate
            });

        } else {

            $scope.employees[$scope.editIndex] = angular.copy($scope.employee);
            $scope.editIndex = -1;

        }

        $scope.resetForm();
    };

    // Edit Employee
    $scope.editEmployee = function (index) {

        $scope.employee = angular.copy($scope.employees[index]);
        $scope.editIndex = index;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // Delete Employee
    $scope.deleteEmployee = function (index) {

        if (confirm("Are you sure you want to delete this employee?")) {

            $scope.employees.splice(index, 1);

        }

    };

    // Clear Form
    $scope.resetForm = function () {

        $scope.employee = {};
        $scope.editIndex = -1;

    };

    // Department Filter
    $scope.departmentFilter = function (employee) {

        if (!$scope.selectedDepartment) {

            return true;

        }

        return employee.department === $scope.selectedDepartment;

    };

    // Total Salary
    $scope.getTotalSalary = function () {

        var total = 0;

        angular.forEach($scope.employees, function (emp) {

            total += Number(emp.salary);

        });

        return total;

    };

});