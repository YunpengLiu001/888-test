const animationList = ['backInLeft', 'backInRight', 'bounceInLeft', 'bounceInRight', 'flipInX', 'flipInY']

function Index () {
    let $form = document.querySelector('#result-form')
    let $input = document.querySelector('#result-input')
    let $resultContent = document.querySelector('#result-content')
    let $button = document.querySelector('#result-submit')
    this.inputValue = new Date()
    this.targetDate = null
    this.currentBitcoinToEUR = null
    this.isLoading = false
    this.isFirst = true
    this.init = function () {
        this.initializeInput()
        this.targetDate = this.getNextLottoDraw(this.inputValue)
        this.bindSubmit()
        this.requestBitcoinPrice()
    }
    this.isDate = function (date) {
        if (date instanceof Date && !isNaN(date.valueOf())) return true
        window.alert('Invalid date, please check your input')
        return false
    }
    this.moreThanTen = function (value) {
        return value >= 10 ? value : '0' + value
    }
    this.transformDate = function (date, type) {
        let year = date.getFullYear()
        let month = this.moreThanTen(date.getMonth() + 1)
        let day = this.moreThanTen(date.getDate())
        let hour = this.moreThanTen(date.getHours())
        let minute = this.moreThanTen(date.getMinutes())
        if (type === 'common') {
            return `${month}/${day}/${year} ${hour}:${minute}`
        }
        if (type === 'standard') {
            return `${month}-${day}-${year} ${hour}:${minute}`
        }
        if (type === 'dayAsParam') {
            return `${day}-${month}-${year}`
        }
        if (type === 'day') {
            return `${month}-${day}-${year}`
        }
        return date
    }
    this.initializeInput = function () {
        $input.value = this.transformDate(this.inputValue, 'common')
    }
    /*
        @des: input a Date, get the next draw date
        @params: Date
        @return: Date
     */
    this.getNextLottoDraw = function (date) {
        const drawHour = 20
        const daysMap = {
            'isWednesday': 3,
            'isSaturday': 6
        }
        const oneMinute = 60 * 1000
        const oneDay = oneMinute * 60 * 24
        let insertedDay = date.getDay()
        let insertedHour = date.getHours()
        let insertedStamp = date.getTime()
        // determine the latest draw date is Wednesday or Saturday
        let targetDay
        if (insertedDay < daysMap.isWednesday
            || (insertedDay === daysMap.isWednesday && insertedHour < drawHour)
            || (insertedDay === daysMap.isSaturday && insertedHour >= drawHour)
        ) {
            targetDay = daysMap.isWednesday
        } else {
            targetDay = daysMap.isSaturday
        }
        // find the difference of day between drawDate and InsertedDay
        // if the difference >= 0 then Subtract directly
        // if not, like Saturday 10pm, which means the InsertedDay is 6, differenceToDrawDay should plus 1 with Math.abs(targetDay - insertedDay)
        let differenceToDrawDay = (targetDay - insertedDay) >= 0 ?  targetDay - insertedDay :  Math.abs(targetDay - insertedDay) + 1
        let targetDateStamp = differenceToDrawDay * oneDay + insertedStamp
        let targetDate = new Date(targetDateStamp)
        targetDate.setHours(drawHour)
        targetDate.setMinutes(0)
        return targetDate
    }
    this.bindSubmit = function () {
        $form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.inputValue = new Date($input.value)
            if (this.isDate(this.inputValue)) {
                this.targetDate = this.getNextLottoDraw(this.inputValue)
                this.requestBitcoinPrice(this.targetDate)
            }
        }, false)
    }
    this.ajaxLoading = function (loading) {
        if (this.isFirst) return
        this.isLoading = loading
        if (loading) {
            $button.innerHTML = 'loading...'
        } else {
            $button.innerHTML = 'SUBMIT'
        }
    }
    this.requestBitcoinPrice = function (date) {
        if (this.isLoading) return
        let xhr = new XMLHttpRequest()
        let method = 'GET'
        let urlCurrentPrice = 'https://api.coingecko.com/api/v3/coins/bitcoin'
        let urlHistoricalPrice = 'https://api.coingecko.com/api/v3/coins/bitcoin/history'
        let url = date ? `${urlHistoricalPrice}?date=${this.transformDate(date, 'dayAsParam')}` : urlCurrentPrice

        this.ajaxLoading(true)
        xhr.open(method, url, true);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                this.ajaxLoading(false)
                let result = JSON.parse(xhr.responseText)
                if (result.market_data) {
                    let eur = result.market_data.current_price.eur
                    this.handleCallback(eur)
                } else {
                    const tips = `Can't get Bitcoin's price on ${this.transformDate(date, 'day')}, please check your input`
                    this.handleCallback(null, tips)
                }
            }
        }
        xhr.onerror = function () {
            window.alert('Something went wrong with the server, please refresh the page or try it later')
        }
        xhr.send()
    }
    this.handleCallback = function (eur, tips) {
        if (this.isFirst) {
            this.isFirst = false
            this.currentBitcoinToEUR = eur
            return
        }
        let worth = eur && 100 / eur * this.currentBitcoinToEUR
        // get a random animation style
        let animationClass = animationList[Math.floor(Math.random() * animationList.length)]
        console.log(animationClass)
        $resultContent.insertAdjacentHTML('afterbegin', `
            <li class="animate ${animationClass}">
                <p>
                    ${this.transformDate(this.targetDate, 'standard')}
                </p>
                <p class=${tips ? 'color-orange' : ''}>
                     ${tips ? tips : '€' + worth}
                </p>
            </li>`)
    }
}
let index = new Index()
index.init()








