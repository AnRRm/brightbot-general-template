const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Load routes
app.post('/weather', getWeather);
app.post('/actualitesante', getActualiteSante);
app.post('/actualiteeconomique', getActualiteEconomique);
app.post('/actualitesportive', getActualiteSportive);
app.post('/actualiteculturelle', getActualiteCulturelle);
app.post('/actualitedivers', getActualiteDivers);
app.post('/athan', getAthan);
app.post('/errors', function (req, res) { 
  console.error(req.body);
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` :) App is listening on port ${PORT}`));

function getweatherpicture(description)
{
	ret = '';
	switch(description) {
    case 'légère pluie':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-showers-scattered-day-icon.png';
        break;
    case 'peu nuageux':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-clouds-icon.png';
        break;
	case 'partiellement nuageux':
	    ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-clouds-icon.png';
        break;
	case 'ciel dégagé':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-clear-icon.png';
        break;
	case 'nuageux':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-many-clouds-icon.png';
        break;
	case 'pluie modérée':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-showers-icon.png';
        break;
    default:
        ret = 'http://icons.iconarchive.com/icons/icons8/ios7/128/Weather-Partly-Cloudy-Rain-icon.png';
	} 
	return ret;
}

function getWeather(req, res) {
	
	const location = req.body.conversation.memory.location;
	const datetime = req.body.conversation.memory.datetime;
	const weather = require('openweathermap-js');
	weather.defaults({
        appid: '681f922539f01fc8d6bd4cd04de6c94a',
        method: 'name',
        mode: 'json',
        units: 'metric',
        lang: 'fr',
     });
	 
	const location_ = location.raw;
	var d = new Date(datetime.iso);
	var timeStamp = d.getTime()/1000;

	weather.forecast({
        location: location_,
        language: 'fr'
    }, function(err, data) {
	if (!err) 
	{									
		// on OK
		var weatherHolder = null;
		 if(data.list != undefined)
			weatherHolder = data.list.find(p => (Math.abs(parseInt(p.dt)-parseInt(timeStamp)) < 5400 ));
	if (!weatherHolder) 
	{
		res.json({
		replies: [
		{ type: 'text', content: 'Désolé Je n\'arrive pas vous indiquer la météo à ' + location.raw + ' le ' + datetime.raw}
		],
		});
	}
	else
	{
		//console.log('diff = '+ (parseInt(weatherHolder.dt)-parseInt(timeStamp)));
		res.json({
			replies: [
						{ type: 'picture', content: getweatherpicture(weatherHolder.weather[0].description ) },
						{ type: 'text', content: 'La météo ' + datetime.raw + ' à ' + location.raw + ':' },  
						{ type: 'text', content: weatherHolder.weather[0].description + ', ' + parseInt(weatherHolder.main.temp) + '°C'  },        
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

function getActualiteSante(req,res)
{
	
	const unirest = require('unirest');
	const replies = [];
	//console.log('getActualiteSante');
	// NEWS API URL
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=health&apiKey=0dfc9750fdec4abe8f4faa8adff562ad';

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
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=business&apiKey=0dfc9750fdec4abe8f4faa8adff562ad';

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
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=sports&apiKey=0dfc9750fdec4abe8f4faa8adff562ad';

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
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=entertainment&apiKey=0dfc9750fdec4abe8f4faa8adff562ad';

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
	const url = 'https://newsapi.org/v2/top-headlines?country=ma&category=technology&apiKey=0dfc9750fdec4abe8f4faa8adff562ad';

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
	var googleAPIurl = 'https://maps.googleapis.com/maps/api/geocode/json?language=fr&address=' + location.raw + '&key=AIzaSyA54Jbwt_JMDBOQujGtB9jFwYzGYO-KAuw';
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
						
						replies.push({ type: 'text', content:'Les horaires de prières le '+ d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' à ' + location.raw + ':'});
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
