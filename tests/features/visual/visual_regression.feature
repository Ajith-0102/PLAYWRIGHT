Feature: Visual regression

  Scenario: Capture baseline and compare with a later screenshot
    Given I capture a baseline screenshot for "homepage"
    # ... perform any actions, navigation or interactions that might change the page ...
    When I capture a latest screenshot for "homepage" and compare with baseline file "2025-11-20-homepage-baseline.png"
    Then the visual difference should be less than 0.5 percent
