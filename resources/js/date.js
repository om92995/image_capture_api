let { render, h, Component } = preact;
/**@jsx h*/

class DatePicker extends Component {
  
  closeDatePicker() {
		this.props.closeFunction(); // Function gets passed by parent
	}
  
  /**
  * Gets fired when a day gets clicked.
  * @param {object} e The event thrown by the <span /> element clicked
  */
	dayClicked(e) {
    
    const element = e.target; // the actual element clicked
 
		if (element.innerHTML === '') return false; // don't continue if <span /> empty
    
    // get date from clicked element (gets attached when rendered)
		const date = new Date(element.getAttribute('date'));
    
    // update the state
	  this.setState({ currentDate: date });
	}
  
  /**
  * returns days in month as array
  * @param {number} month the month to display
  * @param {number} year the year to display
  */
  getDaysByMonth(month, year) {
    
    let calendar = [];
    
    const date = new Date(year, month, 1); // month to display
    
    const firstDay = new Date(year, month, 1).getDay(); // first weekday of month
    const lastDate = new Date(year, month + 1, 0).getDate(); // last date of month
    
    let day = 0;
    
    // the calendar is 7*6 fields big, so 42 loops
    for (let i = 0; i < 42; i++) {
      
      if (i >= firstDay && day !== null) day = day + 1;
      if (day > lastDate) day = null;
      
      // append the calendar Array
      calendar.push({
        day: (day === 0 || day === null) ? null : day, // null or number
        date: (day === 0 || day === null) ? null : new Date(year, month, day), // null or Date()
        today: (day === this.now.getDate() && month === this.now.getMonth() && year === this.now.getFullYear()) // boolean
      });
    }
    
    return calendar;
  }
  
  /**
  * Display previous month by updating state
  */
  displayPrevMonth() {
    if (this.state.displayedMonth <= 0) {
      this.setState({
        displayedMonth: 11,
        displayedYear: this.state.displayedYear - 1
      });
    }
    else {
      this.setState({
        displayedMonth: this.state.displayedMonth - 1
      });
    }
  }
  
  /**
  * Display next month by updating state
  */
  displayNextMonth() {
    if (this.state.displayedMonth >= 11) {
      this.setState({
        displayedMonth: 0,
        displayedYear: this.state.displayedYear + 1
      });
    }
    else {
      this.setState({
        displayedMonth: this.state.displayedMonth + 1
      });
    }
  }
  
  /**
  * Display the selected month (gets fired when clicking on the date string)
  */
  displaySelectedMonth() {
    if (this.state.selectYearMode) {
      this.toggleYearSelector();
    }
    else {
      if (!this.state.currentDate) return false;
      this.setState({
        displayedMonth: this.state.currentDate.getMonth(),
        displayedYear: this.state.currentDate.getFullYear()
      });
    }
  }
  
  toggleYearSelector() {
    this.setState({ selectYearMode: !this.state.selectYearMode });
  }
  
  changeDisplayedYear(e) {
    const element = e.target;
    this.toggleYearSelector();
    this.setState({ displayedYear: parseInt(element.innerHTML, 10), displayedMonth: 0 });
  }
  
  /**
  * Pass the selected date to parent when 'OK' is clicked
  */
  passDateToParent() {
    if (typeof this.props.dateReciever === 'function') this.props.dateReciever(this.state.currentDate);
    this.closeDatePicker();
  }
  
  componentDidUpdate() {
    if (this.state.selectYearMode) {
      document.getElementsByClassName('selected')[0].scrollIntoView(); // works in every browser incl. IE, replace with scrollIntoViewIfNeeded when browsers support it
    }
  }
  
  constructor() {
    super();
    
    this.closeDatePicker = this.closeDatePicker.bind(this);
		this.dayClicked = this.dayClicked.bind(this);
    this.displayNextMonth = this.displayNextMonth.bind(this);
    this.displayPrevMonth = this.displayPrevMonth.bind(this);
    this.getDaysByMonth = this.getDaysByMonth.bind(this);
    this.changeDisplayedYear = this.changeDisplayedYear.bind(this);
    this.passDateToParent = this.passDateToParent.bind(this);
    this.toggleYearSelector = this.toggleYearSelector.bind(this);
    this.displaySelectedMonth = this.displaySelectedMonth.bind(this);
    
    this.monthArrShortFull = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    
    this.monthArrShort = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    
    this.dayArr = [
			'Sun',
			'Mon',
			'Tue',
			'Wed',
			'Thu',
			'Fri',
			'Sat'
		]
    
    this.now = new Date()
    
    this.yearArr = []
    
    for (let i = 1970; i <= this.now.getFullYear() + 30; i++) {
      this.yearArr.push(i);
    }
    
    this.state = {
      currentDate: this.now,
      displayedMonth: this.now.getMonth(),
      displayedYear: this.now.getFullYear(),
      selectYearMode: false
    }
  }
  
  render({ opened }) {
    
    const { currentDate, displayedMonth, displayedYear, selectYearMode } = this.state;
    
    return (
      <div>
				<div class={"datePicker " + (opened && "datePicker--opened")} >
          
					<div class="datePicker--titles">
					  <h3 style={{
                color: selectYearMode ? 'rgba(255,255,255,.87)' : 'rgba(255,255,255,.57)'
              }} onClick={this.toggleYearSelector}>{currentDate.getFullYear()}</h3>
						<h2 style={{
                color: !selectYearMode ? 'rgba(255,255,255,.87)' : 'rgba(255,255,255,.57)'
              }} onClick={this.displaySelectedMonth}>
              {this.dayArr[currentDate.getDay()]}, {this.monthArrShort[currentDate.getMonth()]} {currentDate.getDate()}
            </h2>
					</div>

					{!selectYearMode && <nav>
						<i onClick={this.displayPrevMonth} class="material-icons">&#xE314;</i>
						<h4>{this.monthArrShortFull[displayedMonth]} {displayedYear}</h4>
						<i onClick={this.displayNextMonth} class="material-icons">&#xE315;</i>
					</nav>}
          
          <div class="datePicker--scroll">
            
            {!selectYearMode && <div class="datePicker--calendar" >
              
              <div class="datePicker--dayNames">
                {['S','M','T','W','T','F','S'].map(day => <span>{day}</span>)}
              </div>
              
              <div onClick={this.dayClicked} class="datePicker--days">
                
                {/*
                  Loop through the calendar object returned by getDaysByMonth().
                */}
                
                {this.getDaysByMonth(this.state.displayedMonth, this.state.displayedYear)
                  .map(
                    day => {
                      let selected = false;
                      
                      if (currentDate && day.date) selected = (currentDate.toLocaleDateString() === day.date.toLocaleDateString());
                      
                      return (<span
                        class={(day.today ? 'datePicker--today ' : '') + (selected ? 'datePicker--selected' : '')}
                        disabled={!day.date}
                        date={day.date}
                       >
                        {day.day}
                      </span>)
                    }
                  )
                }
                
              </div>
              
            </div>}
            
            {selectYearMode && <div class="datePicker--selectYear">
              
              {this.yearArr.map(year => (
                <span class={(year === displayedYear) ? 'selected' : ''} onClick={this.changeDisplayedYear}>
                  {year}
                </span>
              ))}
              
            </div>}
            
            {!selectYearMode && <div class="datePicker--actions">
              <button onClick={this.closeDatePicker}>CANCEL</button>
              <button onClick={this.passDateToParent}>OK</button>
            </div>}
            
          </div>
				</div>
        
				<div class="datePicker--background" onClick={this.closeDatePicker} style={{
					display: opened ? 'block' : 'none'
				}}
				/>
        
			</div>
    )
  }
}


class App extends Component {
  
  openDatePicker() {
    this.setState({ datePickerOpened: true });
  }
  
  closeDatePicker() {
    this.setState({ datePickerOpened: false });
  }
  
  toggleDarkTheme() {
    document.body.classList.toggle('darkTheme');
  }
  
  /**
  * Gets passed to DatePicker and fired when date is selected and 'OK' is clicked.
  * @param {object} date the date object of the selected date
  */
  dateReciever(date) {
    this.setState({ pickedDate: date });
  } 
  
  constructor() {
    super();
    
    this.state = {
      datePickerOpened: false
    }
    
    this.openDatePicker = this.openDatePicker.bind(this);
    this.closeDatePicker = this.closeDatePicker.bind(this);
    this.dateReciever = this.dateReciever.bind(this);
  }
  
  render() {
    
    const {
      datePickerOpened
    } = this.state;
    
    return (
      <div>
        <main>
          <h1>Material Design Date Picker 📅</h1>
          <div class="infoBox">A reusable date-picker component build only with <a href="https://preactjs.com/">PreactJS</a>, no MomentJS or other library. Build in Chrome, briefly tested on Edge and Firefox (Quantum). Also only in Pacific Time Zone (don't know if this affects anything).</div>
          <button onClick={this.openDatePicker}>{this.state.pickedDate ? this.state.pickedDate.toLocaleDateString() : 'Pick a date'}</button>
          <button onClick={this.toggleDarkTheme}>Toggle Dark Theme</button>
          
          
          {/*   THE DATEPICKER:   */}
          <DatePicker closeFunction={this.closeDatePicker} opened={datePickerOpened} dateReciever={this.dateReciever} />
          
          
          {this.state.pickedDate && <div class="infoBox">You picked {this.state.pickedDate.toLocaleDateString()}</div>}
        </main>
        <article>
          <h1>About</h1>
          <p>
            I build this date picker component because I needed a fast easy-to-use Preact/React solution to pick dates following the material design guidelines.
          </p>
          <p>
            But I wasn't satisfied by anything I found so I took some time and made this one. If you want to use it for your own projects feel free to copy-paste the DatePicker class!
          </p>
          <p>
            I tried to comment any code that may be unclear, but if you still have any questions, you can ask me via <a href="https://twitter.com/MariusNiver" >Twitter</a> :)
          </p>
        </article>
        <footer>&lt;coded /&gt; with ❤️ and ☕ by <a href="https://niveri.me">Marius Niveri</a></footer>
      </div>
    )
  }
}

// Finally attach app to document body
render(<App />, document.body);