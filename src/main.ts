import {ExampleApiService} from './service/example-api.service'

const exampleApiService: ExampleApiService = ExampleApiService.getInstance()

// No top level await :/
exampleApiService.getAllProducts()
    .then(products => {
        console.log(products)
    })