# PrizePal Raffle

Simple to use raffle software that uses Facebook Groups as a backbone. As such there are few limitations to the process. For instance, only posts in the past 90 days can be shown and also only group administrators can have access to the Groups API.

## How to install

```bash
docker build -t prizepal-raffle -f Dockerfile.prod .
```

```bash
docker run -p 3000:3000 prizepal-raffle
```

### That's all folks

Thank you for visiting. The project is a little messy because I've made it in like 3 hours or so. Fun challenge
