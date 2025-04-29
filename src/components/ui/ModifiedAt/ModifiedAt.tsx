import { Badge } from "@radix-ui/themes";

import { config } from "../../../../package.json";
import { relativeDate } from "../../../utils/relativeDate";
import styles from "./ModifiedAt.module.css";

const MODIFIED_SECONDS = config.last_modified;
const lastModified = relativeDate(MODIFIED_SECONDS);

export const ModifiedAt = () => (
    <Badge size="1" radius="none" color="gray" className={styles.modified}>
        Last modified {lastModified}
    </Badge>

);