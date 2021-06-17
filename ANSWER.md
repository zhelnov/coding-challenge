## How to run
- yarn install
- yarn test
- ETHSCAN_KEY=askmeforkey yarn start worker
- yarn start
## How to manual test
- http POST localhost:3000/start
- http POST localhost:3000/stop
- http GET localhost:3000/ to get data
## Approach
Basically two services, one of them controlls start/stop and data returning to the external consumer.
Second one polls Etherscan api each interval and sends successful result to the first one, if process been started.
## Short-comings
- No persistent storage on data-streams
- No messagequeue-like transport for results from worker to data-streams
- No proper error handling in worker when doing requests and pushing results to data-streams
## Whats to improve
- First of all it needs to be RabbitMQ or Redis-bull transport between worker and data-streams, cause we need to guarantee result delivery to streams. In this case data-streams could fall or be unavailable but then anyway receives messages from MQ.
- Persistent storage on streams - i thought about Postgres + Typeorm. But in this case (api fetches ETH-BTC-USD rates) it could be basic Redis key-value or even smth like AWS Consul. In postgres case it could be helpful to build idempotency (MQ could send message more than once and service should handle it properly, without making a duplicate)
- Error handling strategy for worker - we need to detect massive request failures and monitor it somehow and detect if message bus unavailable. Its important not to loose data that we received response but failed to push in queue. Something like Circuit Breaker pattern here.

