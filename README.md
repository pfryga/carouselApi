# carouselApi
Rest API for carousel-service with NodeJS

version: 1.0.0


## Installation
```
npm install
```

## Development
Run application server and start development
```
npm run serve
```

## Environment
```
localhost:8080
```

## API Guide
Endpoints list
```
localhost:8080/apiDocs
```

| Method  | Path  | Payload | Description |
| :------------ |:---------------| :-----| :-----|
| `GET`     | `/status` | - | Check application status |
| `GET`     | `/carousels/:department` | - | Get carousels list from department |
| `POST`     | `/carousel` | `key`: carousel key,<br />`name`: carousel name,<br />`department`: department key | Add new carousel |
| `DELETE`     | `/carousel` | `key`: carousel key,<br />`department`: department key | Remove carousel from department |
| `GET`     | `/departments` | - | Get departments list |
| `POST`     | `/department` | `key`: department key,<br />`name`: department name | Add new department |
| `DELETE`     | `/department` | `key`: department key | Remove department |
| `GET`     | `/offers/:department/:carousel` | - | Get offers |
| `GET`     | `/offer/:id` | - | Get offer details |
| `POST`     | `/offer/:id` | `department`: department key,<br />`carousel`: carousel key | Add new offer to carousel |
| `DELETE`     | `/offer/:id` | `department`: department key,<br />`carousel`: carousel key | Remove offer from carousel |

## License

Released under the ISC License
