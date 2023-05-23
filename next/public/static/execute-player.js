const url = "#hWzM2MHBdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjLzRmY2JlOGJiNTBiZmFlZjk0MWJlMjM4Yzk4MzFiMDIyOjIwMjMwNTI0MDQ6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZJclZrOTFTUzlWVDB4cVRpOHZlVk5xVW0xWVUxRTlQUT09LzEvNy8zLzAvMi80L2d3Mzh5Lm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvNGZjYmU4YmI1MGJmYWVmOTQxYmUyMzhjOTgzMWIwMjI6MjAyMzA1MjQwNDpNWEppV0Rrd01UVTVXbVZaZWtVcmJrVm9abE5sUm1GcGVXWkhaMFJXUzJkMmVreHJLMEpOT0RWUk1sRk5URVk0VlVsVVozZHBkRWt5WXpoemNEYzJOVklyVms5MVNTOVZUMHhxVGk4dmVWTnFVbTFZVTFFOVBRPT0vMS83LzMvMC8yLzQvZ3czOHkubXA0LFs0ODBwXWh0dHBzOi8vc3RyZWF//_//JCQhIUAkJEBeIUAjJCRAtLnZvaWRib29zdC5jYy9lY2E0NTg5MmM0MTI1MTQ1MWUwMDY2NjQyMTk3MzczMjoyMDIzMDUyNDA0Ok1YSmlXRGt3TVRVNVdtVlpla1VyYmtWb1psTmxSbUZwZVdaSFowUldTMmQyZWt4ckswSk5PRFZSTWxGTlRFWTRWVWxVWjNkcGRFa3lZemh6Y0RjMk5WSXJWazkxU1M5VlQweHFUaTh2ZVZOcVVtMVlVMUU5UFE9PS8xLzcvMy8wLzIvNC9tdnh3Zy5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2VjYTQ1ODkyYzQxMjUxNDUxZTAwNjY2NDIxOTczNzMyOjIwMjMwNTI0MDQ6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJl//_//IyMjI14hISMjIUBAa3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZJclZrOTFTUzlWVDB4cVRpOHZlVk5xVW0xWVUxRTlQUT09LzEvNy8zLzAvMi80L212eHdnLm1wNCxbNzIwcF1odHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvOGI2Mzk2OTg4NTBmODQ1ZGNhOTI1ZTBhNWMwYTM1ODg6MjAyMzA1MjQwNDpNWEppV0Rrd01UVTVXbVZaZWtVcmJrVm9abE5sUm1GcGVXWkhaMFJXUzJkMmVreHJLMEpOT0RWUk1sRk5URVk0VlVsVVozZHBkRWt5WXpoemNEYzJOVklyVms5MVNTOVZUMHhxVGk4dmVWTnFVbTFZVTFFOVBRPT0vMS83LzMvMC8yLzQvNXp3b2QubXA0OmhsczptYW5pZmVzdC5tM3U4IG9yIGh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy84YjYzOTY5ODg1MGY4NDVkY2E5MjVlMGE1YzBhMzU4ODoyMDIzMDUyNDA0Ok1YSmlXRGt3TVRVNVdtVlpla1VyYmtWb1psTmxSbUZwZVdaSFowUldTMmQyZWt4ckswSk5PRFZSTWxGTlRFWTRWVWxVWjNkcGRFa3lZemh6Y0RjMk5WSXJWazkxU1M5VlQweHFUaTh2ZVZOcVVtMVlVMUU5UFE9PS8xLzcvMy8wLzIvNC81endvZC5tcDQsWzEwODBwXWh0dHBzOi8vc3RyZWFtLnZvaWRib29zdC5jYy9hNWUzZmNhYWY3Y2ZiZGYwY2//_//QEBAQEAhIyMhXl5eQwNTJhOTY4MTYyMjQwZToyMDIz//_//Xl5eIUAjIyEhIyM=MDUyNDA0Ok1YSmlXRGt3TVRVNVdtVlpla1VyYmtWb1psTmxSbUZwZVdaSFowUldTMmQyZWt4ckswSk5PRFZSTWxGTlRFWTRWVWxVWjNkcGRFa3lZemh6Y0RjMk5WSXJWazkxU1M5VlQweHFUaTh2ZVZOcVVtMVlVMUU5UFE9PS8xLzcvMy8wLzIvNC9meHpodC5tcDQ6aGxzOm1hbmlmZXN0Lm0zdTggb3IgaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2E1ZTNmY2FhZjdjZmJkZjBjZDA1MmE5NjgxNjIyNDBl//_//JCQjISFAIyFAIyM=OjIwMjMwNTI0MDQ6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZJclZrOTFTUzlWVDB4cVRpOHZlVk5xVW0xWVUxRTlQUT09LzEvNy8zLzAvMi80L2Z4emh0Lm1wNCxbMTA4MHAgVWx0cmFdaHR0cHM6Ly9zdHJlYW0udm9pZGJvb3N0LmNjL2E1ZTNmY2FhZjdjZmJkZjBjZDA1MmE5NjgxNjIyNDBlOjIwMjMwNTI0MDQ6TVhKaVdEa3dNVFU1V21WWmVrVXJia1ZvWmxObFJtRnBlV1pIWjBSV1MyZDJla3hySzBKTk9EVlJNbEZOVEVZNFZVbFVaM2RwZEVreVl6aHpjRGMyTlZJclZrOTFTUzlWVDB4cVRpOHZlVk5xVW0xWVUxRTlQUT09LzEvNy8zLzAvMi80L2Z4emh0Lm1wNDpobHM6bWFuaWZlc3QubTN1OCBvciBodHRwczovL3N0cmVhbS52b2lkYm9vc3QuY2MvYTVlM2ZjYWFmN2NmYmRmMGNkMDUyYTk2ODE2MjI0MGU6MjAyMzA1MjQwNDpNWEppV0Rrd01UVTVXbVZaZWtVcmJrVm9abE5sUm1GcGVXWkhaMFJXUzJkMmVreHJLMEpOT0RWUk1sRk5URVk0VlVsVVozZHBkRWt5WXpoemNEYzJOVklyVms5MVNTOVZUMHhxVGk4dmVWTnFVbTFZVTFFOVBRPT0vMS83LzMvMC8yLzQvZnh6aHQubXA0";


const player = new Playerjs({
	"id": "cdnplayer",
	// "file": url,

});
if (typeof window !== "undefined") {
	window.addEventListener("message", (ev) => {
		if (ev.data.event === 'init') {
			window.o.is_ready = true;
			console.log('is_ready = ' + window.o.is_ready);
			// console.log('url = ' + window.o.FGeRtNzK(url));
		}
	});
}




