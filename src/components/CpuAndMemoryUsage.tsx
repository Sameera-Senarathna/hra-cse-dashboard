import {FC, useEffect, useState} from "react";
import {Gauge} from '@ant-design/plots';
import {getCpuUsage, getMemoryUsage} from "../services/api-calls.service";
import notificationService from "../services/notification.service";
import {Tag} from "antd";

const ticks = [0, 1 / 3, 2 / 3, 1];
const color = ['#30BF78', '#FAAD14', '#F4664A'];

interface CpuAndMemoryUsageProps {
}

const CpuAndMemoryUsage: FC<CpuAndMemoryUsageProps> = () => {

    const [cpuUsage, setCpuUsage] = useState<number[]>([]);
    const [memoryUsage, setMemoryUsage] = useState<number[]>([]);

    useEffect(() => {

        const cpuInterval = setInterval(() => {
            getCpuUsage()
                .then((cpuUsageData) => {
                    setCpuUsage(cpuUsageData)
                })
                .catch((error) => {
                    notificationService("error", "Get CPU Usage Data Error")
                })
        }, 2000);

        const memoryInterval = setInterval(() => {
            getMemoryUsage()
                .then((memoryUsageData) => {
                    setMemoryUsage(memoryUsageData)
                })
                .catch((error) => {
                    notificationService("error", "Get Memory Usage Data Error")
                })
        }, 2000);

        return () => {
            clearInterval(cpuInterval)
            clearInterval(memoryInterval)
        };
    }, []);

    // @ts-ignore
    const config: any = {
        percent: 0.3,
        range: {
            ticks: [0, 1],
            color: ['l(0) 0:#30BF78 0.5:#FAAD14 1:#F4664A'],
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        axis: {
            label: {
                formatter(v: any) {
                    return Number(v) * 100;
                },
            },
            subTickLine: {
                count: 3,
            },
        },
        statistic: {
            title: {
                formatter: ({percent}: any) => {
                    return percent * 100 + " %";
                },
                style: ({percent}: any) => {
                    return {
                        fontSize: '16px',
                        lineHeight: 1,
                        color: percent < ticks[1] ? color[0] : percent < ticks[2] ? color[1] : color[2],
                    };
                },
            },
        },
    };

    // @ts-ignore
    // return <Gauge {...config} />

    return (
        <div style={{display: 'flex'}}>
            <div style={{marginRight: 8}}>
                <Tag>
                    <span style={{fontWeight: 'bold', fontSize: 16}}>CPU:</span>
                    <span style={{fontWeight: 'bold', fontSize: 16}}> {cpuUsage[0] * 100}%</span>
                </Tag>

            </div>
            <div>
                <Tag>
                    <span style={{fontWeight: 'bold', fontSize: 16}}>Memory:</span>
                    <span style={{fontWeight: 'bold', fontSize: 16}}> {memoryUsage[0]}</span>
                </Tag>
            </div>
        </div>
    )
}


export default CpuAndMemoryUsage;