import React, { useContext } from "react"
import { SceneContext } from "../context/SceneContext"
import CustomButton from "./custom-button"
import { getAtlasSize } from "../library/utils"
import stylesX from "../pages/Save.module.css"
import { local } from "../library/store"
import { LanguageContext } from "../context/LanguageContext"

const defaultName = "Anon"

export const ExportMenu = () => {
  // Translate hook
  const { t } = useContext(LanguageContext);
  const [name] = React.useState(localStorage.getItem("name") || defaultName)
  const { model, characterManager } = useContext(SceneContext)

  const [isDownloading, setIsDownloading] = useState(false);

  const getOptions = () =>{
    const currentOption = local["mergeOptions_sel_option"] || 0;
    const createTextureAtlas = local["mergeOptions_create_atlas"] == null ? true:local["mergeOptions_create_atlas"] 
    return {
      createTextureAtlas : createTextureAtlas,
      mToonAtlasSize:getAtlasSize(local["mergeOptions_atlas_mtoon_size"] || 6),
      mToonAtlasSizeTransp:getAtlasSize(local["mergeOptions_atlas_mtoon_transp_size"] || 6),
      stdAtlasSize:getAtlasSize(local["mergeOptions_atlas_std_size"] || 6),
      stdAtlasSizeTransp:getAtlasSize(local["mergeOptions_atlas_std_transp_size"] || 6),
      ktxCompression:local["merge_options_ktx_compression"],
      exportStdAtlas:(currentOption === 0 || currentOption == 2),
      exportMtoonAtlas:(currentOption === 1 || currentOption == 2),
      twoSidedMaterial: (local["mergeOptions_two_sided_mat"] || false)
    }
  }

  const downloadVRM = async (version) =>{
    const options = getOptions();
    /**
     * Blindly assume the whole avatar is VRM0 if the first vrm is VRM0
     */
    options.isVrm0 = Object.values(characterManager.avatar)[0].vrm.meta.metaVersion=='0'
    options.outputVRM0 = !(version === 1)
    
    // Start the download process
    setIsDownloading(true);

    try {
      await characterManager.uploadVRM(name, options);
    } catch (error) {
      console.error("Error uploading VRM:", error);
    } finally {
      // End the download process
      setIsDownloading(false);
    }
  }
  
  const downloadGLB = () =>{
    const options = getOptions();
    characterManager.downloadGLB(name, options);
  }

  return (
    <React.Fragment>
      {/*<CustomButton
        theme="light"
        text="GLB"
        icon="download"
        size={14}
        className={styles.button}
        onClick={() => {
          downloadGLB()
        }}
      />*/}
      <CustomButton
        theme="light"
        text="Save"
        icon="download"
        size={14}
        className={stylesX.buttonRight}
        onClick={()=>downloadVRM(0)}
        disabled={isDownloading}
      />
    </React.Fragment>
  )
}
