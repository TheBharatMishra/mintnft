import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";

const app = express();
const port = process.env.PORT || 5656;

app.use(express.json());

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
});

const starton = axios.create({
  baseURL: "https://api.starton.io/v3",
  headers: {
    "x-api-key": "sk_live_ea52eb09-f107-4471-b665-9c588351d48a",
  },
});

app.post("/upload", cors(), upload.single("file"), async (req, res) => {
  let data = new FormData();

  const blob = new Blob([req.file?.buffer], { type: req.file?.mimetype });
  data.append("file", blob, { filename : req.file?.originalname  });
  data.append("isSync", "true");

async function uploadImageOnIPFS = (){
    const ipfsImg = await starton.post('/ipfs/file',data,{
        headers:{'Content-Type':`multipart/form-data; boundary=${data._boundary}` }
    })
    return ipfsImg.data;
}
async function uploadMetaDataOnIpfs(imgCid:any) {
    const metaDataJson= {
        name:'A Wonderfull NFT',
        description: 'Probably the most wonderful image',
        image:`ipfs://ipfs/${imgCid}`
    }

    const ipfsMetaData = await starton.post('/ipfs/json',{
        name:'My NFT MetaData JSON',
        content:metaDataJson,
        isSync:true
    }
    )
    return ipfsMetaData.data;
}
});


