const schemaList = [{
    name: 'notes',
    keyPath: 'id',
    indexes: [{
        name: 'noteId',
        fields: [ 'id' ]
    }]
}, {
    name: 'lists',
    keyPath: 'id',
    indexes: [{
        name: 'listId',
        fields: [ 'id' ]
    }]
} , {
    name: 'preferrences',
    keyPath: 'id',
    indexes: [{
        name: 'preferrenceId',
        fields: [ 'id' ]
    }]
}
];

const version = 1;

const dbData = {
    name: 'org-list',
    schema: schemaList,
    version: version,
};

export default dbData;