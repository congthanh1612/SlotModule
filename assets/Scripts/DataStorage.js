class DataStorage{
    constructor(){
        this.data =[];
    };

    getData(){
        return this.data;
    };

    setData(data){
        this.data = data;
    };

    clearData(){
        return this.data = [];
    };
};

DataStorage.instance = null;
module.exports = DataStorage;