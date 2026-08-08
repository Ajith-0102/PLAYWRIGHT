@API
Feature: Generic API and UI validation

  Scenario: user validates booking details API with UI
    Given 'Selenium Grid Online':user navigates to url
    When user creates the url
    And user hit "GET" http request for URL
    And user validates the status as "200"
