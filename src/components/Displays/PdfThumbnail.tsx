// import React from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import Icon from '../Icon';
// import PDFViewer from './PdfViewer';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

// export interface PdfThumbnailProps {
//   file: string;
// }

// /**
//  *
//  * This component provides a thumbnail view of the first page of a PDF document. It allows users to click on the thumbnail
//  * to open a PDF viewer in a modal, enabling them to view the full document.
//  *
//  * The thumbnail image is displayed by rendering the first page of the PDF using the `react-pdf` library, and it includes
//  * a maximize icon that appears when the user hovers over the thumbnail. Clicking on the thumbnail opens the PDF in a
//  * full-screen viewer component (`PDFViewer`).
//  *
//  * @interface PdfThumbnailProps
//  * @property {string} file - The URL or path to the PDF file that should be displayed.
//  *
//  */

// const PdfThumbnail = ({ file }: PdfThumbnailProps) => {
//   const [openViewer, setOpenViewer] = React.useState(false);

//   const openModal = () => setOpenViewer(true);
//   const closeModal = () => setOpenViewer(false);

//   return (
//     <div>
//       <div
//         role="button"
//         onClick={openModal}
//         className="cursor-pointer border border-neutral-40 dark:border-neutral-40-dark relative group rounded-md overflow-hidden"
//         title="Open PDF Viewer"
//       >
//         <div className="absolute top-0 left-0 w-full h-full z-10 text-neutral-10 dark:text-neutral-10-dark bg-neutral-100/50 dark:bg-neutral-100-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
//           <Icon name="maximize" size={64} strokeWidth={2} />
//         </div>
//         <Document file={file}>
//           <Page
//             pageNumber={1}
//             scale={0.5}
//             renderAnnotationLayer={false}
//             renderTextLayer={false}
//           />
//         </Document>
//       </div>

//       <PDFViewer open={openViewer} onClose={closeModal} url={file} />
//     </div>
//   );
// };

// export default PdfThumbnail;
