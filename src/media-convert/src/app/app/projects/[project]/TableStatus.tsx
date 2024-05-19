import {TableCell, TableRow} from "~/components/ui/table";
import {ArrowUpToLine, Check, Hourglass, X} from "lucide-react";
import {JSX, SVGProps} from "react";
import {Button} from "~/components/ui/button";
import {truncateFileFunc} from "~/components/file-upload/utils";
import {motion} from "framer-motion";

type TableRowFuncProps = {
    filename: string;
    project: string;
    date: string;
    status: string;
}

export const TableRowFunc: React.FC<TableRowFuncProps> = ({filename, project, date, status}) => {
    let statusComponent, actionButtons;

    console.log("status: ", status)

    switch (status) {
        case 'Converted':
            statusComponent = (<> <Check className="w-5 h-5 text-green-500"/> <span
                className="text-green-500 font-medium">Converted</span> </>);
            actionButtons = <Button>View</Button>;
            break;
        case 'Converting':
            statusComponent = (<> <LoaderIcon className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400"/> <span
                className="text-gray-500 dark:text-gray-400 font-medium">Converting...</span> </>);
            actionButtons = <Button>Cancel</Button>;
            break;
        case 'Initialized':
            statusComponent = (<>
                <motion.div
                    className="w-5 h-5 text-blue-500"
                    initial={{scale: 1, y: 0}}
                    animate={{
                        scale: 1.25,  // Change the scale to your liking
                        y: -5,  // Change this to specify how much the icon should move up
                        transition: {
                            duration: 0.5,  // Change this to control the speed of the animation
                            repeat: Infinity,
                            repeatType: 'reverse',
                            repeatDelay: 0.5
                        }
                    }}
                >
                    <ArrowUpToLine className="w-5 h-5 text-blue-500"/>
                </motion.div>
                <span className="text-blue-500 font-medium">Initialized</span>
            </>);
            actionButtons = <></>;
            break;
        case 'Uploaded':
            statusComponent = (<>
                    <motion.div
                        className="w-5 h-5 text-yellow-500"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1],
                            transition: {
                                duration: 2,
                                ease: 'easeInOut',
                                times: [0, 0.2, 1],
                                repeat: Infinity,
                            }
                        }}
                    >
                        <Hourglass className="w-5 h-5 text-yellow-500"/>
                    </motion.div>
                    <span className="text-yellow-500 font-medium">Uploaded</span>
                </>
            );
            actionButtons = <></>;
            break;
        case 'Failed':
        default:
            statusComponent = (<> <X className="w-5 h-5 text-red-500"/> <span
                className="text-red-500 font-medium">Failed</span> </>);
            actionButtons = <Button>Retry</Button>;
            break;
    }

    return (
        <TableRow key={filename}>
            <TableCell>
                {truncateFileFunc(filename, 10)}
            </TableCell>
            <TableCell>
                {project}
            </TableCell>
            <TableCell>
                {date}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2"> {statusComponent} </div>
            </TableCell>
            <TableCell>
                {actionButtons}
            </TableCell>
        </TableRow>);
}

function LoaderIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="6"/>
        <line x1="12" x2="12" y1="18" y2="22"/>
        <line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/>
        <line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/>
        <line x1="2" x2="6" y1="12" y2="12"/>
        <line x1="18" x2="22" y1="12" y2="12"/>
        <line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/>
        <line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/>
    </svg>)
}
