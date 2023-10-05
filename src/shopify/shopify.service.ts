import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { Shopify, shopifyApi, LATEST_API_VERSION, GraphqlClientParams } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/node';

@Injectable()
export class ShopifyService {
    constructor(private httpService: HttpService) {}
   
    async findProducts() {
        console.log('calling find products');
        const headers = {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': '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',
        }
        const queryString = `{
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  status
                  totalInventory
                  description
                  productType
                  totalVariants
                  variants(first: 10) {
                    nodes {
                      title
                    }
                  }
                }
              }
            }
          }`;

        const query = {'query': queryString};
        const response  = await firstValueFrom(
            this.httpService.post(
                'https://teststorepepe.myshopify.com/admin/api/2023-10/graphql.json', 
                query,
                {headers},
            ).pipe(
                catchError((error: AxiosError) => {
                    console.log(error.response.data);
                  throw 'An error happened!';
                }),
            ),
        );
        console.log(response.data);
        return response.data;
    }

    async findShopifyProducts() {
      const queryString = `{
        products(first: 10) {
          edges {
            node {
              id
              title
              status
              totalInventory
              description
              productType
              totalVariants
              variants(first: 10) {
                nodes {
                  title
                }
              }
            }
          }
        }
      }`;

      const shopify = shopifyApi({
        // The next 4 values are typically read from environment variables for added security
        apiKey: 'e9c7a19e5203314eb573a9350fd818a3',
        apiSecretKey: '376ea3c7c7a4e8351bf13197a1eeb42c',
        scopes: ['read_products'],
        hostName: 'localhost',
        apiVersion: LATEST_API_VERSION,
        isEmbeddedApp: false
      });

      const session = shopify.session.customAppSession("teststorepepe.myshopify.com");
      session.accessToken = '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';

      const client = new shopify.clients.Graphql({ session });

      return client.query({
        data: {
          query: queryString,
        }
      });
    }
}
