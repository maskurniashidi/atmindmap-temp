import MindMapProvider from "./MindMapContext";
import { combineComponents } from "../utils/CombineComponents";

const providers = [MindMapProvider];

export const AppContextProvider = combineComponents(...providers);
