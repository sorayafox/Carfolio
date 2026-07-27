"use client";

import Link from "next/link";
import { AlertCircle, ArrowUpRight, Plus } from "lucide-react";

export function ListPage({title,sub,action,onAdd,notice,children}:any){return <div className="page"><section className="title-row"><div><h2>{title}</h2><p>{sub}</p></div>{action&&<button className="primary" onClick={onAdd}><Plus/>{action}</button>}</section>{notice&&<div className="notice"><AlertCircle/>{notice}</div>}{children}</div>}
export function PanelHead({title,sub,href}:any){return <div className="panel-head"><div><h3>{title}</h3><p>{sub}</p></div>{href&&<Link href={href}>View all <ArrowUpRight/></Link>}</div>}
export function Status({status,text=false}:{status:string,text?:boolean}){return <span className={`status ${status.toLowerCase().replaceAll(" ","-")} ${text?"text":""}`}>{!text&&<i/>}{status}</span>}
