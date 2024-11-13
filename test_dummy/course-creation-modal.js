'use strict';

const assert = require('assert');
const { JSDOM } = require('jsdom');

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
})