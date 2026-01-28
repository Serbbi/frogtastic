## Nice to know

### Push docker images to registry
```
serban@fedora:~/Documents/frogtastic$ docker tag frogtastic-backend registry.webhosting.rug.nl/kamenzlab/frogrepo-backend:latest
serban@fedora:~/Documents/frogtastic$ docker push registry.webhosting.rug.nl/kamenzlab/frogrepo-backend:latest
```

### Expired Token

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbGVuYSIsImV4cCI6MTc1Mzg3NTYxMH0.G8k8nSH0jVI77IeiPUqK_hzlOuIXTIkVf2RaNhk5FJs
```

### S3 file structure
Look at the raw file to understand!

.
├── <organization ID>/
│   ├── reference_images/
│   │   ├── f1t1.png
│   │   ├── f2t1.jpeg
│   │   ├── f3t6.jpg
│   │   └── ...
│   ├── uploads/
│   │   └── f1t1/
│   │       ├── f1t1_2025-08-20_07-05.jpeg
│   │       └── f1t1_2025-09-02_03-35.jpeg
│   └── models/
│       ├── model_<model ID>.h5
│       └── labeler_<labeler ID>.pkl
├── organization_pics/
│   ├── <organization ID>.png
│   └── ...
└── user_profile_pics/
    ├── <user ID>.jpeg
    └── ...