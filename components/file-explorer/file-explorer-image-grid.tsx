import { CloudinaryAsset } from "@/lib/types"
import { CldImage } from "next-cloudinary"

export const ImagesGrid = ({assets}: {assets: CloudinaryAsset[]}) => {
    return (
      <div className="grid-container">
        {assets.map((asset) => (
            <CldImage
            key={asset.public_id}
            src={asset.public_id}
            alt={asset.display_name}
            width="500"
            height="500"
            crop={{
              type: "auto",
              source: true
          }}
            className={""}
          />
        ))}
      </div>
    )
  }