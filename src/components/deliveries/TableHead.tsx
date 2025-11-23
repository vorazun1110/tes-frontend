import { TableCell, TableHeader, TableRow } from "../ui/table";

export default function DeliveryTableHead() {
    return (
        <TableHeader className="border border-gray-400 dark:border-white/[0.05]">
            {/* Grouped headers row */}
            <TableRow className="border border-gray-400 dark:border-white/[0.05]">
                <TableCell colSpan={4} style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-2 font-semibold text-center dark:bg-white/[0.05]">
                    Автомашины мэдээлэл АВТОБААЗ
                </TableCell>
                <TableCell colSpan={4} style={{ backgroundColor: "#FFF2CC" }} className="border border-gray-400 px-5 py-2 font-semibold text-center dark:bg-white/[0.05]">
                    Ачилтын хувиар ГТБА
                </TableCell>
                <TableCell colSpan={3} style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-2 font-semibold text-center dark:bg-white/[0.05]">
                    Баталгаажуулалт АВТОБААЗ
                </TableCell>
                <TableCell colSpan={3} style={{ backgroundColor: "#FFF2CC", position: "sticky", right: 0, zIndex: 10 }} className="border border-gray-400 px-5 py-2 font-semibold text-center dark:bg-white/[0.05]">
                    Админ
                </TableCell>
            </TableRow>

            {/* Actual column headers row */}
            <TableRow className="border border-gray-400 dark:border-white/[0.05]">
                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">№</TableCell>
                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Автомашины дугаар</TableCell>
                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Төлөв</TableCell>
                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Хуваарь</TableCell>

                <TableCell style={{ backgroundColor: "#FFF2CC" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Жолооч</TableCell>
                <TableCell style={{ backgroundColor: "#FFF2CC" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Төлөвлөсөн ШТС байршил/дугаар</TableCell>
                <TableCell style={{ backgroundColor: "#FFF2CC" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Төлөв</TableCell>
                <TableCell style={{ backgroundColor: "#FFF2CC" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Тэмдэглэл</TableCell>

                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Төлөв</TableCell>
                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Тэмдэглэл</TableCell>
                <TableCell style={{ backgroundColor: "#C9DAF8" }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Шийдвэр</TableCell>

                <TableCell style={{ backgroundColor: "#FFF2CC", position: "sticky", right: 0, zIndex: 10 }} className="border border-gray-400 px-5 py-3 text-center font-semibold dark:text-gray-400">Үйлдэл</TableCell>
            </TableRow>
        </TableHeader>
    );
}