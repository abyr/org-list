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
    name: 'preferences',
    keyPath: 'id',
    indexes: [{
        name: 'preferenceId',
        fields: [ 'id' ]
    }]
}, {
    name: 'timeLogs',
    keyPath: 'id',
    indexes: [{
        name: 'logId',
        fields: [ 'id' ]
    }]
}
];

const version = 2;

const dbData = {
    name: 'org-list',
    schema: schemaList,
    version: version,
};

export default dbData;