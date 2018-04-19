<template>
    <div>
        <form>
            <label>Name fields (separated by commas)</label>
            <input v-model="fields"/><br/>
            <label>Number rows</label>
            <input v-model="rows"/><br/>
            <label>Name classes for head, rows odd and rows even (separated by commas)</label>
            <input v-model="meta"/><br/>
            <label>Styles</label>
            <textarea v-model="style" cols="90" rows="10"/><br/>
            <a class="button" v-on:click="addTable">Add table</a>
        </form>
        <div v-for="(table, index) in tables">
            <table-test
                :fields="table.fields"
                :rows="table.rows"
                :meta="table.meta"
                :styles="table.styles">
            </table-test>
            <button v-on:click="deleteTable(index)">
                Delete table
            </button>
        </div>
    </div>
</template>

<script>
    import TableTest from '@/components/TableTest'

    export default {
        name: 'TableGenerator',
        data: function () {
            return {
                tables: [],
                fields: '',
                rows: 0,
                meta: '',
                style: ''
            };
        },
        methods: {
            addTable: function(){

                let item = [];

                item['fields'] = this.fields != '' ? this.fields.replace(' ', '').split(',') : [];
                item['rows'] = Math.ceil(parseInt(this.rows));
                item['meta'] = this.meta.replace(' ', '').split(',');
                item['styles'] = '<style>' + this.style + '</style>';

                this.tables.push(item);

                this.fields = '';
                this.rows = 0;
                this.meta = '';
                this.style = '';
            },
            deleteTable: function(index){

                this.$delete(this.tables, index);
            }
        }
    };
</script>

<style>
    .button{
        color: blue;
        cursor: pointer;
    }
</style>