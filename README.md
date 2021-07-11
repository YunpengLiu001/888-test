# 888-test

## Illustration

* I append a new HTML at the beginning of the list, instead of replace the original HTML, where I think the users may want to do a comparison with different dates.
* the insert animation comes from [animate.css](https://animate.style/)
* test passed on Chrome(91.0.4472.114), Safari (13.1.3), Safari on iOS(14.0.1) FireFox(89.0.2), 
* I didn't do the decimal place selection, which may be decided by Project Manager.


## Compatibility

at the very beginning I try to use ```input[type=datetime-local]``` to implement the time-choose widget.
I checked the compatibility on [canIuse](https://caniuse.com/?search=datetime-local), it shows Firefox(all versions), Safari(under 14.1), Safari on iOS(under 14.7) not supported.
My first thought is I can use this attribute and then handle downgrade logic on not-supported broswers. But I found a crucial problem that the "datetime-local" shows as a ISO format like "day/month/year", which is different from regular format as "month/day/year". this may cause a confusion to users: if the same user open this page on Chrome and Firefox, he will see different formats.

So, I decided to use ```input[type=text]```. hopefully I don't have to develop a full-function calendar widget, I think it will take more than five days' workload. 

The date format compatibility can be seen [here](https://dygraphs.com/date-formats.html)

## Run it
you can run it via Webstorm IDE or [httpserver](https://www.npmjs.com/package/httpserver) or anything you like.

## License
MIT
