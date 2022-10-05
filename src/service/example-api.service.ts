import {ApiPriceRange} from '../model/api-price-range.model'
import {default as axios} from 'axios'
import {ApiResponseModel} from '../model/api-response.model'

export class ExampleApiService {
    private static instance?: ExampleApiService

    private apiPriceRange = ApiPriceRange
    private increasePriceBy: number = 100
    private decreasePriceBy: number = 10
    private exampleApiUrl: string = "https://api.ecommerce.com/products"

    private constructor() {}

    static getInstance() {
        if(!this.instance)
            this.instance = new ExampleApiService()

        return this.instance
    }

    async getAllProducts() {
        let currentMinPrice = this.apiPriceRange.minPrice
        let currentMaxPrice = this.apiPriceRange.minPrice + this.increasePriceBy
        let responseBody: ApiResponseModel
        const products: any[] = []
        const initialRequestUrl = this.getRequestUrl(this.apiPriceRange.minPrice, this.apiPriceRange.maxPrice)
        const { total } = await this.makeRequest(initialRequestUrl)

        while (currentMaxPrice <= this.apiPriceRange.maxPrice) {
            responseBody = await this.makeRequest(this.getRequestUrl(currentMinPrice, currentMaxPrice))

            if (responseBody.total > responseBody.count)
                currentMaxPrice -= this.decreasePriceBy
            else {
                products.push(responseBody.products)
                currentMinPrice = currentMaxPrice
                currentMaxPrice += this.increasePriceBy
            }

            if (products.length == total)
                break
        }

        return products
    }

    private async makeRequest(url: string): Promise<ApiResponseModel> {
        return (await axios.get(url)).data as ApiResponseModel
    }

    private getRequestUrl(minPrice: number, maxPrice: number): string {
        return `${this.exampleApiUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}`
    }
}