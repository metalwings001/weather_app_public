import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'
import './style.css'
import cloud from './images/cloud.png'
import globe from './images/globe.png'
import sun from './images/sun.png'

const cardCounter = [0,1,2,3,4]


const FiveDayForecast = ({weatherList,myDateList,maxTempList,minTempList,dailyIconList}) => {  
  
  return (
    <div>
      <div class="day5title">
        Your 5 day forecast
      </div>
      <div class='day5container'>
      {cardCounter.map(card => 
        <div class ='weather-box-forecast' key = {card}>
          <div class='date'>  {myDateList[card]} </div>
          <div>  <img class="weather-icon"src={`http://openweathermap.org/img/wn/${dailyIconList[card]}@2x.png`} alt="an icon showing current weather"></img></div>
          <div class='weather-text'> High: {Math.round(maxTempList[card])} °F </div>
          <div class='weather-text'> Low: {Math.round(minTempList[card])} °F </div>
        </div>
      )}
      </div>
    </div> 
  )
}

const Blank = () => {
  console.log("inside blank!")
  return (
    <div>
      
    </div>
  )
}

const DailyWeather = ({weatherList}) => {

  console.log("inside DailyWeather!")
  console.log("weahterList: " ,weatherList)

  //const currDate = new Date();
  //console.log(currDate)
  const currDate = new Date()
  let calendarDay = currDate.getDate()
  let calendarMonth = currDate.getMonth()
 
  return (
    <div>
      <div class="weather-box">
        
      <div class="date">
            {calendarMonth+1 + '/' + calendarDay}
          </div>
        <div>
        <img class="weather-icon"src={`http://openweathermap.org/img/wn/${weatherList.current.weather[0].icon}@2x.png`} alt="an icon showing current weather"></img>
        </div>
        <div class ="weather-text">
            current temperature: {Math.round(weatherList.current.temp)} °F
          </div>
          <div class="weather-text">
            current humidity: {weatherList.current.humidity}%
          </div>
          <div class="weather-text">
            chance of rain today: {Math.round(weatherList.daily[0].pop)}% 
          </div>
        </div>
      </div>

    
  
  )
}

const HtmlStructure = () => {
  const [myCity,setCity] = useState("")
  const [myZip,setZip] = useState("")
  const [geoList,setGeoList] = useState([])
  const [weatherList, setWeatherList] = useState([])
  const [update, setUpdate] = useState(0)

  const [myDateList, setDateList] = useState([])
  const [maxTempList, setMaxTempList] = useState([])
  const [minTempList, setMinTempList] = useState([])
  const [dailyIconList, setDailyIcon] = useState([])
  var mid2TitleText = ''
  
  

  const handleCityChange = (event) => {
    setCity(event.target.value)
  }
  const handleZipChange = (event) => {
    setZip(event.target.value)
  }
  const getCordinates = async (event) => {
    if(event) {
      event.preventDefault()
    }
    console.log("inside getCordiantes!")
    console.log('getcord myZip', myZip)
    
    await axios
      .get(`https://nominatim.openstreetmap.org/search?format=json&city=${myCity}`
      + `&postalcode=${myZip}`)
      .then(response => {
        console.log("promise fulfilled1")
        setGeoList(response.data[0])
        return axios.get(`https://api.openweathermap.org/data/2.5/` +
        `onecall?lat=${response.data[0].lat}&lon=${response.data[0].lon}&units=imperial&appid=${process.env.REACT_APP_API_KEY}`)
      }) //an example of chaining axios get calls must use response.data for sequential intended results
      .then(response => {
        console.log('promised fulfilled2')
        setWeatherList(response.data)
        console.log("inside getCordinates weatherList: ", response.data)
        let dateList = []
      
        let minTemp = []
        let maxTemp = []
        let iconList = []
        const currDate = new Date()
        let calendarDay = currDate.getDate()
        let calendarMonth = currDate.getMonth()
    
        console.log(currDate, calendarMonth, calendarDay)
    
        //dateList.push(calendarMonth + 1 + '/' + calendarDay)
        //console.log(dateList)
    
        let myDate = new Date()
        for(let i = 0; i <  5; i++) {
          myDate.setDate(currDate.getDate()+i)
          dateList.push(myDate.getMonth() + 1 + '/' + myDate.getDate())
    
          minTemp.push(response.data.daily[i].temp.min)
          maxTemp.push(response.data.daily[i].temp.max)
          iconList.push(response.data.daily[i].weather[0].icon)
          console.log('test:',response.data.daily[i].weather[0].icon)
          console.log('test2:',response.data.daily[i].weather[0].icon)
        }
        //console.log(dateList,maxTempList,minTempList,dailyIconList)
        console.log(dateList)
    
        setDateList(dateList)
        setMaxTempList(maxTemp)
        setMinTempList(minTemp)
        setDailyIcon(iconList)
        console.log('dailyiconList:',  )
      })
    
    }

  console.log('weatherList.hourly: ', weatherList.hourly)

  return (
    <div class="grid">
      <div class="head">
      <div class="headText">
          <img src={cloud} class = 'logo' alt="a cloud"></img>
          
          
          Weather App
        </div>
        
      </div>
      <div class="sidebar1">

      </div>
      <div class="mid1Title">What's my forecast?</div>
      <div class="mid1">
        
        <form class ="weatherForm" onSubmit={getCordinates}>
          <div class="input-group">
            <label for="city">Enter your city</label>
            <input id="city" type="text" value={myCity} onChange = {handleCityChange} ></input>
          </div>
          <div class="input-group">
            <label for="zipcode">Enter your zipcode</label>
            <input id="zipcode" type="number" value={myZip} onChange = {handleZipChange} ></input>
          </div>
          <div class="input-group">
              <button type="submit" class="btn">Submit</button>
          </div>
        </form>
       
         
      </div>
      <div class="mid2Title"> {weatherList.hourly !== undefined ? "Today's Weather" : ""}</div>
      <div class="mid2">
        {weatherList.hourly !== undefined ? <DailyWeather weatherList={weatherList} />  : <Blank />}

      </div>
      <div class="day5">
      {weatherList.hourly !== undefined ? <FiveDayForecast weatherList={weatherList} myDateList = {myDateList}
      maxTempList = {maxTempList} minTempList = {minTempList} dailyIconList = {dailyIconList}/> : <Blank />}
       
      </div>
      <div class="sidebar2">
        
      </div>
      
      <div class="foot">
        
        Powered by <img src = {sun} class='sun'alt='sun logo'></img>
        openWeather API and <img src = {globe} class='globe' alt ='globe logo'></img>
        Nominatim API
        
      </div>
    

    </div>
  )
}

const App = () => {
  
  return (
    <div>
      <HtmlStructure />
    </div>
  )
}

export default App;