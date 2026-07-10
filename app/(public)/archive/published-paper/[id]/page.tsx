"use client"
import React, { useEffect } from 'react'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CircularProgress from '@mui/material/CircularProgress';
type Props={params:{id:string}}
import {  onGetAllPublishedPaper } from "@/redux/actions/journalActions";
import { useAppDispatch } from '@/lib/hooks/redux';
import { Tooltip } from '@mui/material';
import { useLanguage } from "@/lib/LanguageContext";

const Archive = ({ params }:Props) => {
  const { lang, dir } = useLanguage();

  const [idAchivePaper, setIdAchivePaper] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  

  const dispatch = useAppDispatch();

  useEffect(() => {
    const FetchIdPaper = async () => {
      try {
        const idAchivePapers = await dispatch(onGetAllPublishedPaper());
        setLoading(false)
        const idAchived=idAchivePapers?.filter((paper:any)=>{
          return paper?.id === parseInt(params.id);
        })
        setIdAchivePaper(idAchived);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal records:", error);
      }
    };
    FetchIdPaper();
  }, [dispatch,params?.id]);

  
  return (
    <>
    {loading ? (
      <div className='flex justify-center content-center my-10'>
    <CircularProgress/></div>):
    (idAchivePaper.map((paper: any) => (
            <div className="m-5 px-20 " key={paper.id}>
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <p className='font-bold text-2xl tracking-[1px] p-2 '><span className='font-medium font-serif text-[#004b23]'>Paper {paper.id} </span><span className='font-normal'>: </span>{paper.title}</p>
                <div className='flex items-center gap-2'>
                  <Tooltip arrow placement="bottom" title="Download pdf"> 
                    <div>
                      <a
                        className="text-sm uppercase font-medium px-4 py-2 rounded-md border outline-2 bg-[#064420] text-white hover:bg-white hover:text-[#064420] hover:border-[#064420] transition-all duration-200"   
                        href={paper.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        pdf
                      </a>
                    </div>
                  </Tooltip>
                  <Tooltip arrow placement="bottom" title="Export XML Metadata (JATS)"> 
                    <div>
                      <a
                        className="text-sm uppercase font-medium px-4 py-2 rounded-md border border-[#064420] text-[#064420] bg-white hover:bg-[#064420] hover:text-white transition-all duration-200"   
                        href={`/api/papers/${paper.paperID || paper.id}/metadata`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        JATS XML
                      </a>
                    </div>
                  </Tooltip>
                </div>
              </div>
               <div className=" text-sm font-normal flex items-center p-2">
                <span className="font-serif">Author: </span> <PersonOutlineIcon className="text-[17px] text-[#cdcdcd]"/>
                {paper?.authorNames}
              </div>
              {paper.doi && (
                 <div className="text-sm font-normal flex items-center p-2 gap-1 flex-wrap">
                   <span className="font-serif font-bold text-[#004B23]">
                     {lang === "ar" ? "معرّف الكائن الرقمي (DOI):" : "DOI:"}
                   </span>
                   <a
                     href={`https://doi.org/${paper.doi}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#38B000] hover:text-[#004B23] hover:underline font-mono font-medium transition-colors"
                   >
                     https://doi.org/{paper.doi}
                   </a>
                 </div>
               )}
            <div className='tracking-wide p-3'><span className='italic font-bold font-serif'>Abstract: </span>{paper.abstract}</div>

      <div className='text-sm font-normal flex items-center p-2'>
<span className='font-serif font-extralight'><LocalOfferIcon className='text-[20px] text-[#cdcdcd]'/> Keywords: </span><p>{paper.primaryDomain}</p> 
      </div>
      <hr className='text-[#cdcdcd]' />
      <div className="m-2 indent-5">
            <p>
             <span className="text-base font-light font-serif">Revised Copyright Statement:</span> This publication is openly accessible and licensed under a <span className='text-[#007200] font-bold'>Creative Commons Attribution 4.0 International License</span>, granting unrestricted use, distribution, and reproduction in any medium, including commercial purposes, provided that proper attribution to the original work is maintained.
            </p>
          </div>
              </div>    
          )))} 
    </>
  )
}

export default Archive
