<template>
    <div>
        <form>
            <label>Name fields (separated by commas)</label>
            <input v-model="fields"/><br/>
            <label>Number rows</label>
            <input v-model="rows"/><br/>
            <label>Name classes for head, rows odd and rows even (separated by commas)</label>
            <input v-model="meta"/><br/>
            <button v-on:click="addTable">Add table</button>
        </form>
        <div v-for="(table, index) in tables">
            <table-test
                :fields="table.fields"
                :rows="table.rows"
                :meta="table.meta">
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
        data: function(){

            return {
                tables: [],
                fields: '',
                rows: 0,
                meta: ''
            };
        },
        methods: {
            addTable: function(){

                let item = [];

                item['fields'] = this.fields != '' ? this.fields.replace(' ', '').split(',') : [];
                item['rows'] = Math.ceil(parseInt(this.rows));
                item['meta'] = this.meta.replace(' ', '').split(',');

                this.tables.push(item);

                this.fields = '';
                this.rows = 0;
                this.meta = '';
            },
            deleteTable: function(index){

                this.tables.splice(index, 1);
            }
        }
    };
</script>

<style>

</style>