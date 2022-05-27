<script lang="ts">
	import feathers from '@feathersjs/client';
	import socketio from '@feathersjs/socketio-client';
	import io from 'socket.io-client';
	import { onMount } from 'svelte';

	// @ts-ignore - isProduction comes from Rollup config
	// const API_URL = isProduction ? '/' : 'http://localhost:3030';
	const API_URL = 'http://localhost:3030/';

	const socket = io(API_URL);
	// @ts-ignore
	const feathersApp = feathers();
	feathersApp.configure(socketio(socket));

	// TODO: add type
	let poll: any;

	feathersApp.service('options').on('created', (data) => {
		console.log(data);
	});

	feathersApp.service('votes').on('created', (data) => {
		console.log(data);
	});

	onMount(async () => {
		poll = await feathersApp.service('polls').get('erdukul123');
		// poll = await fetch('http://localhost:3030/polls/erdukul123').then((res) => res.json());
		console.log(poll);
	});
</script>

<main>
	<h1>{poll?.question ?? 'Loading...'}</h1>
</main>

<style>
</style>
