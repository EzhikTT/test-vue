<template>
    <div>
        <form >
            <input v-model="searchQuery"/>
            <a v-on:click="filterSave" href="void:javascript(0)">Search</a>
        </form>
        <table>
            <thead :class="classHead">
                <tr>
                    <th v-for="key in columns"
                        @click="sortBy(key)"
                        :class="{ active: sortKey == key }">
                        {{ key }}
                        <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(entry, index) in filteredData.slice(startRow, startRow + rowsPerPage - 1)" :class="index % 2 ? classOdd : classEven">
                    <td v-for="key in columns">
                        <input v-model="entry[key]">
                    </td>
                    <td>
                        <button v-on:click="deleteRow(index)">
                            -
                        </button>
                    </td>
                    <td>
                        <button v-on:click="addRow(index)" >
                            +
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click=movePages(-1)>Back</button>
            <p>{{startRow / rowsPerPage + 1}} out of {{Math.ceil(filteredData.length / rowsPerPage )}}</p>
            <button @click=movePages(1)>Next</button>
        </div>
        <div>
            <button @click=clearTable()>Clear table</button>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    export default {
        name: 'TableTest',
        props: {
            'fields': {
                type:Array,
                default: []
            },
            'rows': Number,
            'meta': {
                type: Array,
                validator: (value) => {

                   return value.length <= 3;
                }
            }
        },
        data: function () {

            var rowsEmpty = [];
            var rowTemplate = [];
            var sortOrders = [];

            if(this.fields.length > 0 && this.rows > 0){

                for(let i = 0; i < this.fields.length; i++){

                    rowTemplate[this.fields[i]] = '';
                }

                for(let i = 0; i < this.rows; i++){

                    rowsEmpty.splice(0, 0, {});
                }

                this.fields.forEach(function (key) {
                    sortOrders[key] = 1
                });
            }
            else{

                let resAjaxPromise = this.ajaxLoad();

                resAjaxPromise.then((res) => {

                    for(let i = 0; i < res.length; i++){

                        var adress = '';

                        for(let key in res[i]['adress']){

                            adress += key + ': ' + res[i]['adress'][key] + '; ';
                        }

                        res[i]['adress'] = adress;
                    }

                    this.filteredData.push(...res);

                    this.forSwapData = this.filteredData;

                    let keys = Object.keys(res[0]);

                    for(let i = 0; i < keys.length; i++){

                        if(!this.columns.includes(keys[i])){

                            this.columns.push(keys[i]);
                        }
                    }

                    this.columns.forEach(function (key) {
                        sortOrders[key] = 1
                    });
                });
            }

            return {
                filteredData: rowsEmpty,
                columns: this.fields,
                startRow: 0,
                rowsPerPage: 10,
                classHead: this.meta[0],
                classEven: this.meta[1],
                classOdd: this.meta[2],
                searchQuery: '',
                forSwapData: rowsEmpty,
                rowTemp: rowTemplate,
                sortKey: '',
                sortOrders: sortOrders
            }
        },
        methods: {
            ajaxLoad: function () {

                let smallData = 'https://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
                let bigData = 'https://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';

                return fetch(Math.random() >= 0.5 ? bigData : smallData)
                    .then(function(response) {

                        return response.json()
                    });
            },
            deleteRow: function(index) {

                this.filteredData.splice(index, 1);
            },
            addRow: function(index) {

                this.filteredData.splice(index+1, 0, {});
            },
            movePages: function(amount) {

                let newStartRow = this.startRow + (amount * this.rowsPerPage);

                if (newStartRow >= 0 && newStartRow < this.filteredData.length) {

                    this.startRow = newStartRow;
                }
            },
            clearTable: function(){

                this.filteredData = [];
            },
            filterSave: function(){

                if(this.searchQuery !== ""){

                    var query = this.searchQuery;

                    this.filteredData = this.forSwapData;

                    this.filteredData =  this.filteredData.filter(function (row) {
                        return Object.keys(row).some(function (key) {
                            return String(row[key]).toLowerCase().indexOf(query) > -1
                        })
                    })
                }
                else{

                    this.filteredData = this.forSwapData;
                }
            },
            sortBy: function (key) {
                this.sortKey = key;
                this.sortOrders[key] = this.sortOrders[key] * -1;

                var order = (this.sortOrders[key] || 1);

               this.filteredData = this.filteredData.slice().sort(function (a, b) {
                    a = a[key];
                    b = b[key];
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })

            }
        }
    }
</script>

<style>
    .pagination{
        display: inline-flex;
    }
    .search{
        display: flex;
    }
    .arrow {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    }
    .arrow.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid black;
    }
    .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid black;
    }
</style>