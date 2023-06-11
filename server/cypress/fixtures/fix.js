// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
function eval2(p) {
	p = p.replace('var o={play:false', 'var o;window.parent.o = window.o = o = {play:false');
	return eval.call(window, p);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function waitForStreams() {
	window.setTimeout(() => {

		if (!window.o) {
			waitForStreams();
		}
		else {
			const script = [...window.document.body.getElementsByTagName('script')].find(f => f.innerHTML.includes('initCDNMoviesEvents'));
			// console.log('script', script);
			if (script) {
				const streamRegex = /"streams":"(.*?)"/g;
				const cdnRegexp = /initCDNMoviesEvents\((\d+),\s?(\d+)\s?,\s?(\d+)\s?,\s?(\d+)\s?,\s?(\d+)\s?,/g;
				const streamMatch = streamRegex.exec(script.innerText);
				const cdnRegexpMatch = cdnRegexp.exec(script.innerText);

				if (streamMatch) {
					const newStreamId = streamMatch[1].replaceAll('\\/', '/');

					// console.log('newStreamId', newStreamId);
					const newStreams = window.o.FGeRtNzK(newStreamId);
					// console.log('newStreamArray', newStreams);
					const resultDiv = document.createElement('div');
					resultDiv.id = "result";
					resultDiv.innerHTML = newStreams;
					document.body.appendChild(resultDiv);

					const rawResultDiv = document.createElement('div');
					rawResultDiv.id = "rawResult";
					rawResultDiv.innerHTML = JSON.stringify({
						data_translator_id: cdnRegexpMatch[2],
						data_camrip: cdnRegexpMatch[3],
						data_ads: cdnRegexpMatch[4],
						data_director: cdnRegexpMatch[5],
						encoded_video_url: newStreamId,
					});
					console.log('rawResultDiv', rawResultDiv.innerHTML);
					document.body.appendChild(rawResultDiv);

					window.o._translatorsList = document.getElementById('translators-list');
				} else {
					console.error('No streams found.');
				}
			}
			else {
				console.error('script not found');
			}

		}
	}, 100);
}
waitForStreams();

