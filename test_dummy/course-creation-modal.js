'use strict';

const assert = require('assert');
const { JSDOM } = require('jsdom');
const { setTimeout } = require('node:timers/promises');
const db = require('../test/mocks/databasemock.js');
const api = require('../src/api');
const originalPost = api.post;

// Función para crear un espía
function createSpy(fn) {
	const spy = function(...args) {
		spy.calls.push(args);
		return fn.apply(this, args);
	};
	spy.calls = []; // Almacena las llamadas
	return spy;
};

describe('Group Creation Modal', () => {
	before(() => {
		const dom = new JSDOM('<html><body></body></html>');
		global.window = dom.window;
		global.document = dom.window.document;
		document.body.innerHTML = '<button data-action="new">Create Group</button>';

		global.jQuery = require('jquery');
		global.$ = global.jQuery;
		const { $ } = global;

		global.config = { userLang: 'en-GB' };

		global.define = function (moduleName, dependencies, factory) {
			global[moduleName] = factory(...dependencies.map(dep => global[dep]));
		};

		const list = require('../public/src/client/groups/list');
		const bootbox = require('bootbox');

		list.init;
	});

	it('should show modal when create group button is clicked', () => {
		$('button[data-action="new"]').click();

		setTimeout(() => {
			const modal = $('.bootbox'); // Seleccionar el modal creado por bootbox
			assert(modal.length > 0, 'Modal should be created');
			assert(modal.is(':visible'), 'Modal should be visible');
			done();
		}, 100);
	});

	it('should have required form fields in modal', () => {
		$('button[data-action="new"]').click();

		/* Check specific fields exist */
		setTimeout(() => {
			const modal = $('.bootbox'); // Seleccionar el modal creado por bootbox
			//console.log(modal.html()); // Imprimir el contenido del modal para depuración

			// Verificar que los campos requeridos existan en el modal
			assert(modal.find('#newGroupCode').length > 0, 'Code field should exist');
			assert(modal.find('#newGroupName').length > 0, 'Name field should exist');
			assert(modal.find('#newGroupTrim').length > 0, 'Trimester field should exist');
			assert(modal.find('#newGroupYear').length > 0, 'Year field should exist');
			assert(modal.find('#newGroupSecc').length > 0, 'Section field should exist');

			/* Check field attributes */
			// Code field should be text input
			assert.equal(modal.find('#newGroupCode').attr('type'), 'text', 'Code field should be text input');
			// Name field should be text input
			assert.equal(modal.find('#newGroupName').attr('type'), 'text', 'Name field should be text input');

			// Trimmester field should be a select element
			const trimSelect = $('.bootbox #newGroupTrim');
			assert.equal(trimSelect.prop('tagName').toLowerCase(), 'select');
			// Check number of options in Trimmester field
			assert.equal(trimSelect.find('option').length, 4);
			// Check specific option values in Trimmester field
			const expectedValues = ['JM', 'AJ', 'SD', 'SC'];
			trimSelect.find('option').each(function (index) {
				assert.equal($(this).val(), expectedValues[index]);
			});

			// Year field should be a select element
			const yearSelect = $('.bootbox #newGroupYear');
			assert.equal(yearSelect.prop('tagName').toLowerCase(), 'select');
			// Check number of options in Year field
			assert.equal(yearSelect.find('option').length, 10);
			// Check specific option values in Year field
			const currentYear = new Date().getFullYear();
			yearSelect.find('option').each(function (index) {
				assert.equal($(this).val(), currentYear + index);
			});

			// Section field should be a select element
			const sectionSelect = $('.bootbox #newGroupSecc');
			assert.equal(sectionSelect.prop('tagName').toLowerCase(), 'select');
			// Check number of options in Section field
			assert.equal(sectionSelect.find('option').length, 10);
			// Check specific option values in Section field
			sectionSelect.find('option').each(function (index) {
				assert.equal($(this).val(), index + 1);
			});

			done();
		}, 100);
	});

	it('should create a group when all fields are valid', function(done) {
		const currentYear = new Date().getFullYear();
		const expectedPayload = {
			name: `CI3715 | Ingenieria de Software I | SD ${currentYear} | Sec. 1`,
		};
		api.post = createSpy(originalPost);
		
		$('button[data-action="new"]').click();

		$('#newGroupCode').val('CI3715');
		$('#newGroupName').val('Ingenieria de Software I');
		$('#newGroupTrim').val('SD');

		setTimeout(() => {
			$('.bootbox .btn-primary').click();

			const calls = api.post.calls;
			assert.equal(calls.length, 1); // Debe haber una llamada
			assert.deepEqual(calls[0][0], '/groups'); // Verifica la URL
			assert.deepEqual(calls[0][1], expectedPayload);
			done();
		}, 100);

		api.post = originalPost;
		done();
	});

	describe('should not create a group when one of the required fields is empty', () =>{
		beforeEach(() => {
			api.post = createSpy(originalPost);
			$('button[data-action="new"]').click();
		});
		
		it('should not create a group when the code field is empty', function(done) {
			$('#newGroupCode').val('');
			$('#newGroupName').val('Ingenieria de Software I');
			$('#newGroupTrim').val('SD');

			setTimeout(() => {
				$('.bootbox .btn-primary').click();

				const calls = api.post.calls;
				assert.equal(calls.length, 0); // No debe haber llamadas a la API

				done();
			}, 100);
			done();
		});

		it('should not create a group when the name field is empty', function(done) {
			$('#newGroupCode').val('CI3715');
			$('#newGroupName').val('');
			$('#newGroupTrim').val('SD');

			setTimeout(() => {
				$('.bootbox .btn-primary').click();

				const calls = api.post.calls;
				assert.equal(calls.length, 0); // No debe haber llamadas a la API

				done();
			}, 100);
			done();
		});

		it('should not create a group when the name field is empty', function(done) {
			$('#newGroupCode').val('CI3715');
			$('#newGroupName').val('Ingenieria de Software I');
			$('#newGroupTrim').val('');

			setTimeout(() => {
				$('.bootbox .btn-primary').click();

				const calls = api.post.calls;
				assert.equal(calls.length, 0); // No debe haber llamadas a la API

				done();
			}, 100);
			done();
		});

		afterEach(() => {
			api.post = originalPost;
		});
	});

	describe('should show an error modal when code or name fields are invalid', () =>{
		beforeEach(() => {
			api.post = createSpy(originalPost);
			$('button[data-action="new"]').click();
		});

		it('should show an error modal when code field is invalid', function(done) {
			// Asignamos valores inválidos a los campos
			$('#newGroupCode').val('CI-3715'); // Campo de código erroneo
			$('#newGroupName').val('Ingenieria de Software I');
			$('#newGroupTrim').val('SD');
	
			setTimeout(() => {
				$('.bootbox .btn-primary').click(); // Simulamos el clic en el botón de confirmar
	
				// Aquí verificamos que se ha creado la ventana modal
				const modal = $('.bootbox'); // Suponiendo que la clase de la ventana modal es 'bootbox'
				assert.isTrue(modal.is(':visible')); // Verificamos que la modal esté visible
				
				assert(modal.find('h5.text-danger').length > 0, 'Modal should have a title with class text-danger');
				assert(modal.find('h5.text-danger').includes('Error in Course ID'), 'Modal title should include "Error in Course ID"');
	
				done();
			}, 100);
			done();
		});

		it('should show an error modal when name field is invalid', function(done) {
			// Asignamos valores inválidos a los campos
			$('#newGroupCode').val('CI3715');
			$('#newGroupName').val('Alimentacion, nutricion y salud del hombre contemporaneo'); // Campo de nombre erroneo
			$('#newGroupTrim').val('SD');
	
			setTimeout(() => {
				$('.bootbox .btn-primary').click(); // Simulamos el clic en el botón de confirmar
	
				// Aquí verificamos que se ha creado la ventana modal
				const modal = $('.bootbox'); // Suponiendo que la clase de la ventana modal es 'bootbox'
				assert.isTrue(modal.is(':visible')); // Verificamos que la modal esté visible
				
				assert(modal.find('h5.text-danger').length > 0, 'Modal should have a title with class text-danger');
				assert(modal.find('h5.text-danger').includes('Error in Course Name'), 'Modal title should include "Error in Course Name"');
	
				done();
			}, 100);
			done();
		});

		afterEach(() => {
			api.post = originalPost;
		});
	});
})