@FormSubmission
@AjaxForm
Feature: Ajax Form Submission

  Scenario: Submit the Ajax Form with valid name and message
    Given 'Selenium Grid Online':user navigates to url
    When 'Selenium Grid Online':user clicks on "Ajax Form Submit"
    When 'Selenium Grid Online':user fills title textbox with "uday"
    And 'Selenium Grid Online':user fills description textbox with "Hi"
    And 'Selenium Grid Online':user clicks on "submit" button
