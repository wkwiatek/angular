'use strict';"use strict";
var webdriver = require('selenium-webdriver');
exports.browser = global['browser'];
exports.$ = global['$'];
function clickAll(buttonSelectors) {
    buttonSelectors.forEach(function (selector) { exports.$(selector).click(); });
}
exports.clickAll = clickAll;
function verifyNoBrowserErrors() {
    // TODO(tbosch): Bug in ChromeDriver: Need to execute at least one command
    // so that the browser logs can be read out!
    exports.browser.executeScript('1+1');
    exports.browser.manage().logs().get('browser').then(function (browserLog) {
        var filteredLog = browserLog.filter(function (logEntry) {
            if (logEntry.level.value >= webdriver.logging.Level.INFO.value) {
                console.log('>> ' + logEntry.message);
            }
            return logEntry.level.value > webdriver.logging.Level.WARNING.value;
        });
        expect(filteredLog).toEqual([]);
    });
}
exports.verifyNoBrowserErrors = verifyNoBrowserErrors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXNQaFNyVGtLLnRtcC9hbmd1bGFyMi9zcmMvdGVzdGluZy9lMmVfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBWSxTQUFTLFdBQU0sb0JBQW9CLENBQUMsQ0FBQTtBQUVyQyxlQUFPLEdBQXdCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxTQUFDLEdBQXNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUU5QyxrQkFBeUIsZUFBZTtJQUN0QyxlQUFlLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxJQUFJLFNBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFGZSxnQkFBUSxXQUV2QixDQUFBO0FBRUQ7SUFDRSwwRUFBMEU7SUFDMUUsNENBQTRDO0lBQzVDLGVBQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsZUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxVQUFVO1FBQzdELElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBUyxRQUFRO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFiZSw2QkFBcUIsd0JBYXBDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3ZWJkcml2ZXIgZnJvbSAnc2VsZW5pdW0td2ViZHJpdmVyJztcblxuZXhwb3J0IHZhciBicm93c2VyOiBwcm90cmFjdG9yLklCcm93c2VyID0gZ2xvYmFsWydicm93c2VyJ107XG5leHBvcnQgdmFyICQ6IGNzc1NlbGVjdG9ySGVscGVyID0gZ2xvYmFsWyckJ107XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGlja0FsbChidXR0b25TZWxlY3RvcnMpIHtcbiAgYnV0dG9uU2VsZWN0b3JzLmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3IpIHsgJChzZWxlY3RvcikuY2xpY2soKTsgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlOb0Jyb3dzZXJFcnJvcnMoKSB7XG4gIC8vIFRPRE8odGJvc2NoKTogQnVnIGluIENocm9tZURyaXZlcjogTmVlZCB0byBleGVjdXRlIGF0IGxlYXN0IG9uZSBjb21tYW5kXG4gIC8vIHNvIHRoYXQgdGhlIGJyb3dzZXIgbG9ncyBjYW4gYmUgcmVhZCBvdXQhXG4gIGJyb3dzZXIuZXhlY3V0ZVNjcmlwdCgnMSsxJyk7XG4gIGJyb3dzZXIubWFuYWdlKCkubG9ncygpLmdldCgnYnJvd3NlcicpLnRoZW4oZnVuY3Rpb24oYnJvd3NlckxvZykge1xuICAgIHZhciBmaWx0ZXJlZExvZyA9IGJyb3dzZXJMb2cuZmlsdGVyKGZ1bmN0aW9uKGxvZ0VudHJ5KSB7XG4gICAgICBpZiAobG9nRW50cnkubGV2ZWwudmFsdWUgPj0gd2ViZHJpdmVyLmxvZ2dpbmcuTGV2ZWwuSU5GTy52YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnPj4gJyArIGxvZ0VudHJ5Lm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvZ0VudHJ5LmxldmVsLnZhbHVlID4gd2ViZHJpdmVyLmxvZ2dpbmcuTGV2ZWwuV0FSTklORy52YWx1ZTtcbiAgICB9KTtcbiAgICBleHBlY3QoZmlsdGVyZWRMb2cpLnRvRXF1YWwoW10pO1xuICB9KTtcbn1cbiJdfQ==