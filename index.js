﻿const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Load routes by using express utility
app.post('/weather',				getWeather);
app.post('/greetings', 				getGreetingReply);
app.post('/actualitesante',			getActualiteSante);				// Currently not in use
app.post('/actualiteeconomique',	getActualiteEconomique);
app.post('/actualitesportive',		getActualiteSportive);
app.post('/actualiteculturelle',	getActualiteCulturelle);		// Currently not in use
app.post('/actualitedivers',		getActualiteDivers);
app.post('/athan', 					getAthan);


app.post('/errors', function (req, res) { 
  console.error(req.body);
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` :) App is listening on port ${PORT}`));

// this function must be moved to utils
function getweatherpicture(description)
{
	ret = '';
	switch(description) {
    case 'légère pluie':
        ret = 'http://icons.iconarchive.com/icons/handdrawngoods/sunny-weather/128/12-rain-umbrella-icon.png';
        break;
    case 'peu nuageux':
        ret = 'http://icons.iconarchive.com/icons/fasticon/nature/128/Cloud-Sun-icon.png';
        break;
	case 'partiellement nuageux':
	    ret = 'http://icons.iconarchive.com/icons/fasticon/nature/128/Cloud-Sun-icon.png';
        break;
	case 'ciel dégagé':
        ret = 'http://icons.iconarchive.com/icons/fasticon/nature/128/Sun-icon.png';
		
        break;
	case 'nuageux':
        ret = 'http://icons.iconarchive.com/icons/fasticon/nature/128/Cloud-icon.png';
        break;
	case 'pluie modérée':
        ret = 'http://icons.iconarchive.com/icons/double-j-design/super-mono-3d/128/weather-rain-icon.png';
        break;
    default:
        ret = 'http://icons.iconarchive.com/icons/icons8/ios7/128/Weather-Partly-Cloudy-Rain-icon.png';
	} 
	return ret;
}


function getGreetingReply(req, res) {
	
	var userName = req.body.conversation.participant_data.userName;
	
	if(undefined == userName)
	{
		userName = "";
	}
	else
	{
		userName = userName + " ";
	}
	
	res.json({
	replies: [
	{ type: 'text', content: 'Bonjour ' + userName + '🙂'  },
	{ type: 'text', content: 'Je suis l\'outil d\'assistance virtuelle de BrightBot. Je suis en mesure de répondre à beaucoup de questions par rapport à BrightBot, je peux aussi te donner les news, la météo, ou encore les horaires de prières... il suffit de demander..'}
	],
	});
}

function getWeather(req, res) {
	
	const location = req.body.conversation.memory.location;
	const datetime = req.body.conversation.memory.datetime;
	const weather = require('openweathermap-js');

	weather.defaults({
        appid: process.env.OPENWMAP_ID,
        method: 'coord',
        mode: 'json',
        units: 'metric',
        lang: 'fr',
     });
	const location_ = location.raw;
	var d = new Date(datetime.iso);
	var tmpdate = d.getDate();
	d.setUTCHours(23,59,59,990);
	
	var timeStamp = d.getTime()/1000;

	weather.forecast({
        coord: {lat: location.lat, lon: location.lng},
        language: 'fr'
    }, function(err, data) {
	if (!err) 
	{									
		// on OK
		var weatherHolder = null;
		 if(data.list != undefined)
			weatherHolder = data.list.find(p => (Math.abs(parseInt(p.dt)-parseInt(timeStamp)) < 500));


	if (!weatherHolder) 
	{		
		res.json({
		replies: [
		{ type: 'text', content: 'Désolé Je n\'arrive pas vous indiquer la météo à ' + capitalizeFirstLetter(location.raw) + ' le ' + datetime.raw}
		],
		});
	}
	else
	{
		var temperature_array = [];
		var rain_array = [];
		for(var i=data.list.indexOf(weatherHolder); i >= data.list.indexOf(weatherHolder) - 7 ; i--)
		{
			var weatherHolder_ = null;
			weatherHolder_ = data.list[i];
			if(null != data.list[i])
			{
				temperature_array.push(parseInt(weatherHolder_.main.temp));
			}			
		}
		res.json({
			replies: [
						{ type: 'picture', content: getweatherpicture(weatherHolder.weather[0].description ) },
						{ type: 'text', content: weatherHolder.weather[0].description   },
						{ type: 'text', content:  Math.min.apply(null, temperature_array) + '°C' + '  -  ' + Math.max.apply(null, temperature_array) + '°C' }, 						
					],
				});
	}		
    } 
	else
	{
		res.json({
		replies: [
					{ type: 'text', content: `Je n'arrive pas vous indiquer la meteo a ${location.raw} le ${datetime.iso}` }
				],
		});
	}
	});	
}

// TODO: This function is not in user actualy
function getActualiteSante(req,res)
{
	
	const unirest = require('unirest');
	const replies = [];
	
	// NEWS API URL
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=health&apiKey=' + process.env.NEWSAPI_TOKEN;

	// send http get request
	unirest.get(url)
	.send()
	.end(response => {

		// Loop on all the found news / provide titles and urls
		if (response.ok) {
			const MaxCount = Math.min(response.body.totalResults,4);
			for (var index = 0; index < MaxCount; index++) 
			{
				if(response.body.articles[index].urlToImage != null)
					replies.push({ type: 'picture', content: response.body.articles[index].urlToImage });
				if(response.body.articles[index].title != null)
					replies.push({ type: 'text', content: response.body.articles[index].title });
				if(response.body.articles[index].url != null)
					replies.push({ type: 'text', content: response.body.articles[index].url });
			}
			res.json({replies: replies});
		} 
		else 
		{
			
		}

	})
}

function getActualiteEconomique(req,res)
{
	const unirest = require('unirest');
	const replies = [];

	// NEWS API URL
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=business&apiKey=' + process.env.NEWSAPI_TOKEN;

	// send http get request
	unirest.get(url)
	.send()
	.end(response => {

		// Loop on all the found news / provide titles and urls
		if (response.ok) {
			const MaxCount = Math.min(response.body.totalResults,4);
			for (var index = 0; index < MaxCount; index++) 
			{
				if(response.body.articles[index].urlToImage != null)
					replies.push({ type: 'picture', content: response.body.articles[index].urlToImage });
				if(response.body.articles[index].title != null)
					replies.push({ type: 'text', content: response.body.articles[index].title });
				if(response.body.articles[index].url != null)
					replies.push({ type: 'text', content: response.body.articles[index].url });
			}
			res.json({replies: replies});
		} 
		else 
		{
			
		}

	})
}

function getActualiteSportive(req,res)
{
	const unirest = require('unirest');
	const replies = [];

	// NEWS API URL
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=sports&apiKey=' + process.env.NEWSAPI_TOKEN;

	// send http get request
	unirest.get(url)
	.send()
	.end(response => {

		// Loop on all the found news / provide titles and urls
		if (response.ok) {
			const MaxCount = Math.min(response.body.totalResults,4);
			for (var index = 0; index < MaxCount; index++) 
			{
				if(response.body.articles[index].urlToImage != null)
					replies.push({ type: 'picture', content: response.body.articles[index].urlToImage });
				if(response.body.articles[index].title != null)
					replies.push({ type: 'text', content: response.body.articles[index].title });
				if(response.body.articles[index].url != null)
					replies.push({ type: 'text', content: response.body.articles[index].url });
			}
			
			res.json({replies: replies});
		} 
		else 
		{
			
		}

	})
}

function getActualiteCulturelle(req,res)
{
	const unirest = require('unirest');
	const replies = [];

	// NEWS API URL
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=entertainment&apiKey=' + process.env.NEWSAPI_TOKEN;

	// send http get request
	unirest.get(url)
	.send()
	.end(response => {

		// Loop on all the found news / provide titles and urls
		if (response.ok) {
			const MaxCount = Math.min(response.body.totalResults,4);
			for (var index = 0; index < MaxCount; index++) 
			{
				if(response.body.articles[index].urlToImage != null)
					replies.push({ type: 'picture', content: response.body.articles[index].urlToImage });
				if(response.body.articles[index].title != null)
					replies.push({ type: 'text', content: response.body.articles[index].title });
				if(response.body.articles[index].url != null)
					replies.push({ type: 'text', content: response.body.articles[index].url });
			}
			res.json({replies: replies});
		} 
		else 
		{
			
		}

	})

}

function getActualiteDivers(req,res)
{
	const unirest = require('unirest');
	const replies = [];

	// NEWS API URL
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=technology&apiKey=' + process.env.NEWSAPI_TOKEN;

	// send http get request
	unirest.get(url)
	.send()
	.end(response => {

		// Loop on all the found news / provide titles and urls
		if (response.ok) {
			const MaxCount = Math.min(response.body.totalResults,4);
			for (var index = 0; index < MaxCount; index++) 
			{
				if(response.body.articles[index].urlToImage != null)
					replies.push({ type: 'picture', content: response.body.articles[index].urlToImage });
				if(response.body.articles[index].title != null)
					replies.push({ type: 'text', content: response.body.articles[index].title });
				if(response.body.articles[index].url != null)
					replies.push({ type: 'text', content: response.body.articles[index].url });
			}
			res.json({replies: replies});
		} 
		else 
		{
			
		}

	})
}

function getAthan(req,res)
{
	
	const unirest = require('unirest');
	const location = req.body.conversation.memory.location;
	const datetime = req.body.conversation.memory.datetime;
	
	const replies = [];
	replies.push({ type: 'picture', content:'http://viaimage2.viafrance.com/img/img-1000x1000/2/8/3/283273_1000x1000.jpg'});
	var googleAPIurl = 'https://maps.googleapis.com/maps/api/geocode/json?language=fr&address=' + location.raw + '&key=' + process.env.GMAPAPI_KEY;
	unirest.get(googleAPIurl)
    .send()
    .end(response => {
		if (response.ok) {
			
			const d = new Date(datetime.iso);
			const timeStamp = d.getTime()/1000;
			
			if(response.body.results[0] != undefined && response.body.results[0].geometry != undefined)
			{
				const lat = response.body.results[0].geometry.location.lat;
				const lng = response.body.results[0].geometry.location.lng;
				const athanurl = 'http://api.aladhan.com/timings/' + timeStamp + '?latitude=' + lat + '&longitude=' + lng + '&method=2';
				unirest.get(athanurl)
				.send()
				.end(response => {

					if (response.status == 200) 
					{
						
						replies.push({ type: 'text', content:'Les horaires de prières le '+ d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' à ' + capitalizeFirstLetter(location.raw) + ':'});
						replies.push({ type: 'text', content:'Salat Al-Fajr: ' + response.body.data.timings.Fajr});
						replies.push({ type: 'text', content:'Salat Al-Dhuhr: ' + response.body.data.timings.Dhuhr});
						replies.push({ type: 'text', content:'Salat Al-Asr: ' + response.body.data.timings.Asr});
						replies.push({ type: 'text', content:'Salat Al-Maghrib: ' + response.body.data.timings.Maghrib});
						replies.push({ type: 'text', content:'Salat Al-Isha: ' + response.body.data.timings.Isha});
						replies.push({ type: 'text', content:'تقبل الله صلاتكم بمزيد من الاجر والثواب'});
						res.json({replies: replies});
					}
				}

				)
			}
			else
			{
				    res.json({
					replies: [
						{ type: 'text', content: 'je n\'arrive pas à trouver les horaires de prières pour la ville que vous avez indiqué :(, désolé' },
					],
				});
				}
			}
	}
	)
}

// TODO this function must be moved to Utils
function capitalizeFirstLetter(string) 
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}
